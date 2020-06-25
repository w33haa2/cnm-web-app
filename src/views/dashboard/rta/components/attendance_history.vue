<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props:['height'],
  mounted () {
    const datasets4 = [
      {
        label: 'My First dataset',
        backgroundColor: '#67C23A',
        borderColor: 'teal',
        data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
      },
      {
        label: 'My second dataset',
        backgroundColor: '#F56C6C',
        borderColor: 'teal',
        data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
      },
      {
        label: 'My First dataset',
        backgroundColor: '#E6A23C',
        borderColor: 'teal',
        data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
      },
      {
        label: 'My second dataset',
        backgroundColor: '#eee',
        borderColor: 'teal',
        data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
      }
    ]
    this.renderChart(
      {
        labels: ['15th', '16th', '17th', '18th', '19th', '20th', '21th', '22th', '23th', '24th', '25th', '26th', '27th', '28th', '29th', '30th'],
        datasets: datasets4
      },
      {
        tooltips: {
          enabled: true,
        },
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            categoryPercentage: 1,
            barPercentage: 0.5,
            stacked:true
          }],
          yAxes: [{
            display: true,
            stacked:true
          }]
        }
      }
    )
  }
}
</script>
