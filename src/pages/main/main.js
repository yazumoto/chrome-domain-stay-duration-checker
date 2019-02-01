document.addEventListener("DOMContentLoaded", function(event) {
  tabInfo.useTabInfo().then(() => {
    riot.mount('main', {
      info: tabInfo
    })
  });
});
// document.addEventListener("DOMContentLoaded", function(event) {
//   tabInfo.useTabInfo().then(() => {
//     let html = `<div>`;
//     var msToTime =  function(s) {
//       var ms = s % 1000;
//       s = (s - ms) / 1000;
//       var secs = s % 60;
//       s = (s - secs) / 60;
//       var mins = s % 60;
//       var hrs = (s - mins) / 60;
//
//       return hrs + ':' + mins + ':' + secs;
//     };
//
//     Object.keys(tabInfo.domainDuration).map((domain) => {
//       return {
//         domain: domain,
//         duration: tabInfo.domainDuration[domain],
//       }
//     }).sort((a, b) => {
//       // duration の降順
//       return (a.duration > b.duration) ? -1 : 1;
//     }).forEach((domainDuration) => {
//       html +=
//         `<div>
//             <label style="display: inline-block; width: 200px;">${domainDuration.domain}</label>
//             <span>${msToTime(domainDuration.duration)}</span>
//         </div>`
//     });
//     html += `</div>`;
//
//     document.getElementById("body").innerHTML = html;
//   });
// });