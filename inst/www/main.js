$(document).ready(function() {
  
  $("#convert_button").attr("disabled", "disabled");
  $("#preview_button").attr("disabled", "disabled");
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

            $("#convert_button").attr("href", session.getLoc())
            $("#water_level").removeAttr("disabled");
            $("#convert_button").removeAttr("disabled");
            $("#preview_button").removeAttr("disabled");
            $("#step_2").css("opacity", 1);
            $("#step_3").css("opacity", 1);

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

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
        update_zipfile_input(session)
      }).fail(function(jqXHR){
         //failure
         errormsg(jqXHR.responseText);
        })
  });

    //Check if user changes water level input
    document.getElementById("water_level")[0].addEventListener('change', function(){
        $("#preview_button").removeAttr("disabled");
    });


  $("#preview_button").on("click", function(){

      //////////////////////////////
      //Plot Preview
      //////////////////////////////

      //create the plot area on the plotdiv element
      var req = $("#plotdiv").rplot("mip_data_plot", {
        mipfile : $("#mipfile")[0].files[0],
        water_level : $('#water_level').val()
      }, function(session){
        //configure inputs on/off
        //success
        $("#preview_button").attr("disabled", "disabled");
      }).fail(function(jqXHR){
        //failure
        $("#preview_button").removeAttr("disabled");
        errormsg(jqXHR.responseText);
       })
    
  });

  //Javascript function using jszip.j / filesaver.js
  //to package .zip output
  function update_zipfile_input(session){

      //////////////////////////////
      //Update .zipfile
      //////////////////////////////

      csv_file = session.getLoc()+'R/.val/csv'
      data_file = $("#mipfile")[0].files[0];
      file_names = session.getLoc()+'files'

      $.get(file_names, function(f){

      zipname = f.split('\n')[0]
      filename = zipname.substr(0, f.split('\n')[0].length -8);

      JSZipUtils.getBinaryContent(file_names + '/' + zipname, function(err, data) {

          if(err) {throw err;}// or handle err

          zip = new JSZip(data);

          $.get(csv_file, function(d){
              d = d.replace(/,/g, '\t').replace(/['"]+/g, '\t')
              zip.file(filename+'.mhp', d)
              var content = zip.generate({type:"blob"});
              saveAs(content, zipname);
          });

        });   
    });
  }

  $(document).ajaxStart(function() {
    $(".progress").show();
  }); 
  
  $(document).ajaxStop(function() {
    $(".progress").hide();
  });
  
});