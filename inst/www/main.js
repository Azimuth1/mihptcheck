$(document).ready(function() {
  
  $("#convert_button").attr("disabled", "disabled");
  $("#water_level").attr("disabled", "disabled");

  //automatically upload CSV file on change.
  $("#mipfile").on("change", function(){

    //verify that a file is selected
    if($("#mipfile")[0].files[0]){

      $("#successdiv").empty();
      $("#errordiv").empty()

      //////////////////////////////
      //Upload and validate the data
      //////////////////////////////

      var req = ocpu.call("zip_validation", {
        mipfile : $("#mipfile")[0].files[0]
      }, function(session){
        // $("#convert_button").attr("href", session.getLoc())
        $("#water_level").removeAttr("disabled");
        $("#convert_button").removeAttr("disabled");
        $("#step_2").css("opacity", 1);
        $("#step_3").css("opacity", 1);
        zipContents()
      }).fail(function(jqXHR){
        $("#step_2").css("opacity", 0.2);
        $("#step_3").css("opacity", 0.2);
        errormsg(jqXHR.responseText);
      })
    }
  });
  
  //R output to popup
  function successmsg(text){
    $("#successdiv").empty().append('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert">&times;</a>' + text + '</div>');
  }

  //R output to popup
  function errormsg(text){
    $("#convert_button").attr("disabled", "disabled");
    $("#water_level").attr("disabled", "disabled");
    $("#errordiv").empty().append('<div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert">&times;</a>' + text + '</div>');
  }  
      
  //Javascript function using jszip.j / filesaver.js
  //to package .zip output
  function create_zip(data_file){
    $.get(file_names, function(f){
      var zip = new JSZip();
      zipname = f.split('\n')[0]
      filename = zipname.substr(0, f.split('\n')[0].length -8);
        $.get(data_file, function(d){
          //removing double quotes
          d = d.replace(/['"]+/g, '').replace(/\//g, "$").replace(/\/n$a\:\w*$/,0); //this is ugly
          zip.file(filename+'.mhp', d)
          zip.generateAsync({type:"blob"})
          .then(function(content) {
              saveAs(content, zipname);
          });
      });
    });   
  }
  
  function zipContents(){
    var req = ocpu.call("zip_contents", {
        mipfile : $("#mipfile")[0].files[0]
      }, function(session){
        //success
        tab_file = session.getLoc()+'R/.val/tab'
        create_zip(tab_file)
      }).fail(function(jqXHR){
        //failure
        errormsg(jqXHR.responseText);
    })
  }

  $("#convert_button").on("click", function(){
  
      //////////////////////////////
      //Water level calculations
      //////////////////////////////

      var req = ocpu.call("mip_calc", {
          mipfile : $("#mipfile")[0].files[0],
          water_level : $('#water_level').val()
        }, function(session){
          //success
          tab_file = session.getLoc()+'R/.val/tab'
          create_zip(tab_file)
        }).fail(function(jqXHR){
          //failure
          errormsg(jqXHR.responseText);
      })
  
  
  });
      
  $(document).ajaxStart(function() {
    $(".progress").show();
  }); 
  
  $(document).ajaxStop(function() {
    $(".progress").hide();
  });
  
    
});