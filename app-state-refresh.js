/* Fitness Master — refresh the app shell when the active account receives a remote cloud update. */
(function(){
'use strict';
let reloading=false;
window.addEventListener('fm-cloud-data-updated',function(){
  if(reloading)return;
  reloading=true;
  location.reload();
});
})();
