import tippy from 'tippy.js';

import { SimResult, SimResultFilter,UnitMetrics } from '../../proto_utils/sim_result.js';
import { maxIndex, sum } from '../../utils.js';
import { ColumnSortType, MetricsTable } from './metrics_table.js';
import { ResultComponent, ResultComponentConfig, SimResultData } from './result_component.js';
import { ResultsFilter } from './results_filter.js';
import { SourceChart } from './source_chart.js';

export class PlayerDamageTakenMetricsTable extends MetricsTable<UnitMetrics> {
	private readonly resultsFilter: ResultsFilter;

	// Cached values from most recent result.
	private resultData: SimResultData | undefined;
	private raidDtps: number;
	private maxDtps: number;

	constructor(config: ResultComponentConfig, resultsFilter: ResultsFilter) {
		config.rootCssClass = 'player-damage-taken-metrics-root';
		super(config, [
			MetricsTable.playerNameCellConfig(),
			{
				name: 'Amount',
				tooltip: 'Player Damage Taken / Raid Damage Taken',
				headerCellClass: 'amount-header-cell',
				fillCell: (player: UnitMetrics, cellElem: HTMLElement, rowElem: HTMLElement) => {
					cellElem.classList.add('amount-cell');

					let chart: HTMLElement | null = null;
					const makeChart = () => {
						const chartContainer = document.createElement('div');
						rowElem.appendChild(chartContainer);
						if (this.resultData) {
							const targets = this.resultData.result.getTargets(this.resultData.filter);
							const playerFilter = {
								player: player.unitIndex,
							}
							const targetActions = targets.map(target => target.getMeleeActions().concat(target.getSpellActions()).map(action => action.forTarget(playerFilter))).flat();
							const sourceChart = new SourceChart(chartContainer, targetActions);
						}
						return chartContainer;
					};

					tippy(rowElem, {
						content: 'Loading...',
						placement: 'bottom',
						ignoreAttributes: true,
						onShow(instance: any) {
							if (!chart) {
								chart = makeChart();
								instance.setContent(chart);
							}
						},
					});

					cellElem.innerHTML = `
						<div class="player-damage-percent">
							<span>${(player.dtps.avg / this.raidDtps * 100).toFixed(2)}%</span>
						</div>
						<div class="player-damage-bar-container">
							<div class="player-damage-bar bg-${player.classColor}" style="width:${player.dtps.avg / this.maxDtps * 100}%"></div>
						</div>
						<div class="player-damage-total">
							<span>${(player.totalDamageTaken / 1000).toFixed(1)}k</span>
						</div>
					`;
				},
			},
			{
				name: 'DTPS',
				tooltip: 'Damage Taken / Encounter Duration',
				columnClass: 'dps-cell',
				sort: ColumnSortType.Descending,
				getValue: (metric: UnitMetrics) => metric.dtps.avg,
				getDisplayString: (metric: UnitMetrics) => metric.dtps.avg.toFixed(1),
			},
		]);
		this.resultsFilter = resultsFilter;
		this.raidDtps = 0;
		this.maxDtps = 0;
	}

	customizeRowElem(player: UnitMetrics, rowElem: HTMLElement) {
		rowElem.classList.add('player-damage-row');
		rowElem.addEventListener('click', event => {
			this.resultsFilter.setPlayer(this.getLastSimResult().eventID, player.unitIndex);
		});
	}

	getGroupedMetrics(resultData: SimResultData): Array<Array<UnitMetrics>> {
		this.resultData = resultData;
		const players = resultData.result.getPlayers(resultData.filter);

		this.raidDtps = sum(players.map(player => player.dtps.avg));
		const maxDpsIndex = maxIndex(players.map(player => player.dtps.avg))!;
		this.maxDtps = players[maxDpsIndex].dtps.avg;

		return players.map(player => [player]);
	}
}