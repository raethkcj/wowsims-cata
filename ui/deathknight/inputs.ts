import { Spec } from '../core/proto/common.js';
import { UnitReference, UnitReference_Type as UnitType } from '../core/proto/common.js';

import {
	DeathknightMajorGlyph,
} from '../core/proto/deathknight.js';

import * as InputHelpers from '../core/components/input_helpers.js';
import { Player } from '../core/player';
import { EventID, TypedEvent } from '../core/typed_event';

// Configuration for spec-specific UI elements on the settings tab.
// These don't need to be in a separate file but it keeps things cleaner.

export const SelfUnholyFrenzy = InputHelpers.makeSpecOptionsBooleanInput<Spec.SpecDeathknight>({
	fieldName: 'unholyFrenzyTarget',
	label: 'Self Unholy Frenzy',
	labelTooltip: 'Cast Unholy Frenzy on yourself.',
	extraCssClasses: [
		'within-raid-sim-hide',
	],
	getValue: (player: Player<Spec.SpecDeathknight>) => player.getSpecOptions().unholyFrenzyTarget?.type == UnitType.Player,
	setValue: (eventID: EventID, player: Player<Spec.SpecDeathknight>, newValue: boolean) => {
		const newOptions = player.getSpecOptions();
		newOptions.unholyFrenzyTarget = UnitReference.create({
			type: newValue ? UnitType.Player : UnitType.Unknown,
			index: 0,
		});
		player.setSpecOptions(eventID, newOptions);
	},
	showWhen: (player: Player<Spec.SpecDeathknight>) => player.getTalents().hysteria,
	changeEmitter: (player: Player<Spec.SpecDeathknight>) => TypedEvent.onAny([player.rotationChangeEmitter, player.talentsChangeEmitter]),
});

export const StartingRunicPower = InputHelpers.makeSpecOptionsNumberInput<Spec.SpecDeathknight>({
	fieldName: 'startingRunicPower',
	label: 'Starting Runic Power',
	labelTooltip: 'Initial RP at the start of each iteration.',
});

export const PetUptime = InputHelpers.makeSpecOptionsNumberInput<Spec.SpecDeathknight>({
	fieldName: 'petUptime',
	label: 'Ghoul Uptime (%)',
	labelTooltip: 'Percent of the fight duration for which your ghoul will be on target.',
	percent: true,
	showWhen: (player: Player<Spec.SpecDeathknight>) => player.getTalents().masterOfGhouls,
});

export const PrecastGhoulFrenzy = InputHelpers.makeSpecOptionsBooleanInput<Spec.SpecDeathknight>({
	fieldName: 'precastGhoulFrenzy',
	label: 'Pre-Cast Ghoul Frenzy',
	labelTooltip: 'Cast Ghoul Frenzy 10 seconds before combat starts.',
	showWhen: (player: Player<Spec.SpecDeathknight>) => player.getTalents().summonGargoyle && player.getTalents().ghoulFrenzy,
	changeEmitter: (player: Player<Spec.SpecDeathknight>) => TypedEvent.onAny([player.specOptionsChangeEmitter, player.rotationChangeEmitter, player.talentsChangeEmitter]),
});

export const PrecastHornOfWinter = InputHelpers.makeSpecOptionsBooleanInput<Spec.SpecDeathknight>({
	fieldName: 'precastHornOfWinter',
	label: 'Pre-Cast Horn of Winter',
	labelTooltip: 'Precast Horn of Winter for 10 extra runic power before fight.',
});

export const DrwPestiApply = InputHelpers.makeSpecOptionsBooleanInput<Spec.SpecDeathknight>({
	fieldName: 'drwPestiApply',
	label: 'DRW Pestilence Add',
	labelTooltip: 'There is currently an interaction with DRW and pestilence where you can use pestilence to force DRW to apply diseases if they are already applied by the DK. It only works with Glyph of Disease and if there is an off target. This toggle forces the sim to assume there is an off target.',
	showWhen: (player: Player<Spec.SpecDeathknight>) => player.getTalentTree() == 0 && (player.getGlyphs().major1 == DeathknightMajorGlyph.GlyphOfDisease || player.getGlyphs().major2 == DeathknightMajorGlyph.GlyphOfDisease || player.getGlyphs().major3 == DeathknightMajorGlyph.GlyphOfDisease),
	changeEmitter: (player: Player<Spec.SpecDeathknight>) => TypedEvent.onAny([player.specOptionsChangeEmitter, player.rotationChangeEmitter, player.talentsChangeEmitter]),
});

export const NewDrwInput = InputHelpers.makeSpecOptionsBooleanInput<Spec.SpecDeathknight>({
	fieldName: 'newDrw',
	label: 'PTR DRW Scaling',
	showWhen: (player: Player<Spec.SpecDeathknight>) => player.getTalents().dancingRuneWeapon,
	changeEmitter: (player: Player<Spec.SpecDeathknight>) => TypedEvent.onAny([player.rotationChangeEmitter, player.talentsChangeEmitter]),
})

export const DiseaseDowntime = InputHelpers.makeSpecOptionsNumberInput<Spec.SpecDeathknight>({
	fieldName: 'diseaseDowntime',
	label: 'Disease Downtime',
	labelTooltip: 'Maximum allowed downtime between disease applications.',
	showWhen: (player: Player<Spec.SpecDeathknight>) => player.getTalentTree() == 2,
	changeEmitter: (player: Player<Spec.SpecDeathknight>) => TypedEvent.onAny([player.rotationChangeEmitter, player.talentsChangeEmitter]),
});
