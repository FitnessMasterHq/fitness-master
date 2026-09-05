/* Keep the user-facing library focused on short, directly relevant technique segments. */
(function(){'use strict';if(typeof EXERCISES==='undefined')return;Object.keys(EXERCISES).forEach(n=>{if(Array.isArray(EXERCISES[n].videos))EXERCISES[n].videos=EXERCISES[n].videos.filter(v=>!String(v[2]||'').includes('18 dk'));});})();
