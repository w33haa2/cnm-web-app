<script>
export default {
  name: 'AuthRedirect',
  created() {
    const hash = window.location.search.slice(1)
    if (window.localStorage) {
      console.log(window.localStorage)
      window.localStorage.setItem('x-admin-oauth-code', hash)
      window.close()
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
