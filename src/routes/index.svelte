<script>
import io from 'socket.io-client'
import Chart from 'svelte-frappe-charts'
import { onMount } from 'svelte'

let socket

const formatTime = date => date.getTime()

let pressure = [0]
let flow = [0]
let timestamp = [new Date()]

let mounted = false

$: pressureChartData = {
	labels: timestamp,
	datasets: [{ values: pressure }]
}

$: flowChartData = {
	labels: timestamp,
	datasets: [{ values: flow }]
}

onMount(() => {
	mounted = true
	socket = io()
	socket.on('new data', data => {
		pressure = [...pressure, data.pressure]
		flow = [...flow, data.flow]
		timestamp = [...timestamp, data.timestamp]
		if (pressure.length > 100) {
			pressure = pressure.slice(1)
			flow = flow.slice(1)
			timestamp = timestamp.slice(1)
		}
	})
})
</script>

<svelte:head>
	<title>Ventilator</title>
</svelte:head>
{#if mounted}
	<Chart data={pressureChartData} type="line" />
	<Chart data={flowChartData} type="line" />
{/if}