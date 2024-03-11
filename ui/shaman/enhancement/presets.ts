import * as PresetUtils from '../../core/preset_utils.js';
import { Consumes, Debuffs, Faction, Flask, Food, Glyphs, Potions, RaidBuffs, TristateEffect } from '../../core/proto/common.js';
import {
	AirTotem,
	EarthTotem,
	EnhancementShaman_Options as EnhancementShamanOptions,
	FireTotem,
	ShamanImbue,
	ShamanMajorGlyph,
	ShamanShield,
	ShamanSyncType,
	ShamanTotems,
	WaterTotem,
} from '../../core/proto/shaman.js';
import { SavedTalents } from '../../core/proto/ui.js';
import DefaultFt from './apls/default_ft.apl.json';
import DefaultWf from './apls/default_wf.apl.json';
import Phase3Apl from './apls/phase_3.apl.json';
import P1Gear from './gear_sets/p1.gear.json';
import P2FtGear from './gear_sets/p2_ft.gear.json';
import P2WfGear from './gear_sets/p2_wf.gear.json';
import P3AllianceGear from './gear_sets/p3_alliance.gear.json';
import P3HordeGear from './gear_sets/p3_horde.gear.json';
import P4FtGear from './gear_sets/p4_ft.gear.json';
import P4WfGear from './gear_sets/p4_wf.gear.json';
import PreraidGear from './gear_sets/preraid.gear.json';

// Preset options for this spec.
// Eventually we will import these values for the raid sim too, so its good to
// keep them in a separate file.

export const PRERAID_PRESET = PresetUtils.makePresetGear('Preraid Preset', PreraidGear);
export const P1_PRESET = PresetUtils.makePresetGear('P1 Preset', P1Gear);
export const P2_PRESET_FT = PresetUtils.makePresetGear('P2 Preset FT', P2FtGear);
export const P2_PRESET_WF = PresetUtils.makePresetGear('P2 Preset WF', P2WfGear);
export const P3_PRESET_ALLIANCE = PresetUtils.makePresetGear('P3 Preset [A]', P3AllianceGear, { faction: Faction.Alliance });
export const P3_PRESET_HORDE = PresetUtils.makePresetGear('P3 Preset [H]', P3HordeGear, { faction: Faction.Horde });
export const P4_PRESET_FT = PresetUtils.makePresetGear('P4 Preset FT', P4FtGear);
export const P4_PRESET_WF = PresetUtils.makePresetGear('P4 Preset WF', P4WfGear);

export const ROTATION_FT_DEFAULT = PresetUtils.makePresetAPLRotation('Default FT', DefaultFt);
export const ROTATION_WF_DEFAULT = PresetUtils.makePresetAPLRotation('Default WF', DefaultWf);
export const ROTATION_PHASE_3 = PresetUtils.makePresetAPLRotation('Phase 3', Phase3Apl);

// Default talents. Uses the wowhead calculator format, make the talents on
// https://wowhead.com/cata/talent-calc and copy the numbers in the url.
export const StandardTalents = {
	name: 'Standard',
	data: SavedTalents.create({
		talentsString: '053030152-30405003105021333031131031051',
		glyphs: Glyphs.create({
			major1: ShamanMajorGlyph.GlyphOfFireNova,
			major2: ShamanMajorGlyph.GlyphOfFlametongueWeapon,
			major3: ShamanMajorGlyph.GlyphOfFeralSpirit,
			//minor glyphs dont affect damage done, all convenience/QoL
		}),
	}),
};

export const Phase3Talents = {
	name: 'Phase 3',
	data: SavedTalents.create({
		talentsString: '053030152-30505003105001333031131131051',
		glyphs: Glyphs.create({
			major1: ShamanMajorGlyph.GlyphOfFireNova,
			major2: ShamanMajorGlyph.GlyphOfFlametongueWeapon,
			major3: ShamanMajorGlyph.GlyphOfFeralSpirit,
			//minor glyphs dont affect damage done, all convenience/QoL
		}),
	}),
};

export const DefaultOptions = EnhancementShamanOptions.create({
	classOptions: {
		shield: ShamanShield.LightningShield,
		totems: ShamanTotems.create({
			earth: EarthTotem.StrengthOfEarthTotem,
			fire: FireTotem.MagmaTotem,
			water: WaterTotem.ManaSpringTotem,
			air: AirTotem.WindfuryTotem,
		}),
		imbueMh: ShamanImbue.WindfuryWeapon,
	},
	imbueOh: ShamanImbue.FlametongueWeapon,
	syncType: ShamanSyncType.Auto,
});

export const DefaultConsumes = Consumes.create({
	defaultPotion: Potions.PotionOfSpeed,
	flask: Flask.FlaskOfEndlessRage,
	food: Food.FoodFishFeast,
});

export const DefaultRaidBuffs = RaidBuffs.create({
	giftOfTheWild: TristateEffect.TristateEffectImproved,
	arcaneBrilliance: true,
	leaderOfThePack: TristateEffect.TristateEffectImproved,
	totemOfWrath: true,
	wrathOfAirTotem: true,
	moonkinAura: TristateEffect.TristateEffectImproved,
	sanctifiedRetribution: true,
	divineSpirit: true,
	battleShout: TristateEffect.TristateEffectImproved,
	demonicPactSp: 500,
});

export const DefaultDebuffs = Debuffs.create({
	bloodFrenzy: true,
	sunderArmor: true,
	curseOfWeakness: TristateEffect.TristateEffectRegular,
	curseOfElements: true,
	faerieFire: TristateEffect.TristateEffectImproved,
	judgementOfWisdom: true,
	misery: true,
	totemOfWrath: true,
	shadowMastery: true,
});
