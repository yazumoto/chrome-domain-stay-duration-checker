<main>
    <h4>{ opts.info.currentDateString }</h4>
    <div each={ item, i in items} class="domain-wrapper">
        <label>{ item.domain }</label>
        <span>{ msToTime(item.duration) }</span>
    </div>
    <script>
        this.msToTime = function (s) {
          var ms = s % 1000;
          s = (s - ms) / 1000;
          var secs = s % 60;
          s = (s - secs) / 60;
          var mins = s % 60;
          var hrs = (s - mins) / 60;

          return hrs + ':' + mins + ':' + secs;
        };

        this.items = Object.keys(this.opts.info.domainDuration).map((domain) => {
          return {
            domain: domain,
            duration: tabInfo.domainDuration[domain],
          }
        }).sort((a, b) => {
          // duration の降順
          return (a.duration > b.duration) ? -1 : 1;
        });
    </script>
</main>