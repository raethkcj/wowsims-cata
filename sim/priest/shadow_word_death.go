package priest

import (
	"time"

	"github.com/wowsims/wotlk/sim/core"
	"github.com/wowsims/wotlk/sim/core/proto"
	"github.com/wowsims/wotlk/sim/core/stats"
)

func (priest *Priest) registerShadowWordDeathSpell() {
	baseCost := priest.BaseMana * 0.12

	playerMod := (1 + float64(priest.Talents.Darkness)*0.02 + float64(priest.Talents.TwinDisciplines)*0.01)
	// target := priest.CurrentTarget // Add this section when we get target health simmed to investigate SWD glyph
	// if priest.GlyphOfShadowWordDeath && target.CurrentHealth < 0.35*target.MaxHealth{
	//	playerMod = 1 * (1 + float64(priest.Talents.Darkness)*0.02 + float64(priest.Talents.TwinDisciplines)*0.01) *
	//	core.TernaryFloat64(priest.Talents.Shadowform, 1.15, 1)*1.1,
	//}

	priest.ShadowWordDeath = priest.RegisterSpell(core.SpellConfig{
		ActionID:    core.ActionID{SpellID: 48158},
		SpellSchool: core.SpellSchoolShadow,

		ResourceType: stats.Mana,
		BaseCost:     baseCost,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				Cost: baseCost * (1 - 0.02*float64(priest.Talents.MentalAgility)),
				GCD:  core.GCDDefault,
			},
			CD: core.Cooldown{
				Timer:    priest.NewTimer(),
				Duration: time.Second * 12,
			},
		},

		ApplyEffects: core.ApplyEffectFuncDirectDamage(core.SpellEffect{
			ProcMask:             core.ProcMaskSpellDamage,
			BonusSpellHitRating:  float64(priest.Talents.ShadowFocus) * 1 * core.SpellHitRatingPerHitChance,
			BonusSpellCritRating: float64(priest.Talents.MindMelt) * 2 * core.CritRatingPerCritChance,
			DamageMultiplier:     playerMod,
			ThreatMultiplier:     1 - 0.08*float64(priest.Talents.ShadowAffinity),
			OnSpellHitDealt: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				if spellEffect.Landed() {
					priest.AddShadowWeavingStack(sim)
				}
				if spellEffect.DidCrit() && priest.HasGlyph(int32(proto.PriestMajorGlyph_GlyphOfShadow)) {
					priest.ShadowyInsightAura.Activate(sim)
				}
			},
			BaseDamage: core.WrapBaseDamageConfig(
				core.BaseDamageConfigMagic(750, 870, 0.429),
				func(oldCalculator core.BaseDamageCalculator) core.BaseDamageCalculator {
					return func(sim *core.Simulation, spellEffect *core.SpellEffect, spell *core.Spell) float64 {
						swMod := 1 + float64(priest.ShadowWeavingAura.GetStacks())*0.02
						dmg := oldCalculator(sim, spellEffect, spell)

						return dmg * swMod
					}
				}),
			OutcomeApplier: priest.OutcomeFuncMagicHitAndCrit(priest.SpellCritMultiplier(1, float64(priest.Talents.ShadowPower)/5)),
		}),
	})
}
