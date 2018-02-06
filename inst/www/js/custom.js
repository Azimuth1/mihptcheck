function dev_toggle(val = TRUE){
  //Display if dev.html or not
  if (val){
    try{
        var cur_url = window.location.href.split(/[\\\/]/)[window.location.href.split(/[\\\/]/).length - 1];
        if (cur_url == "dev.html") {
        $("#dev_check").html(cur_url);
        }
    }catch(ex){
        console.warning("#dev_check not configured.")
        }
    }
}