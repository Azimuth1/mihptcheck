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

            $("#convert_button").attr("href", session.getLoc())
            $("#water_level").removeAttr("disabled");
            $("#convert_button").removeAttr("disabled");
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
      //disable the button to prevent multiple clicks
      $("#convert_button").attr("disabled", "disabled");

      //read the value for 'myname'
      var nfield = getRandomInt(1, 1000)
      var distfield = getRandomInt(1, 10)

      //create the plot area on the plotdiv element
      var req = $("#plotdiv").rplot("randomplot", {
          n : nfield,
          dist : distfield
      })

  });
      
  $("#preview_button").on("click", function(){

      //////////////////////////////
      //Plot Preview
      //////////////////////////////

  });

  //Javascript function using jszip.j / filesaver.js
  //to package .zip output
  function update_zipfile_input(session){

      //////////////////////////////
      //Update .zipfile
      //////////////////////////////

      tab_file = session.getLoc()+'R/.val/tab'
      data_file = $("#mipfile")[0].files[0];
      file_names = session.getLoc()+'files'

      $.get(file_names, function(f){

      zipname = f.split('\n')[0]
      filename = zipname.substr(0, f.split('\n')[0].length -8);

      JSZipUtils.getBinaryContent(file_names + '/' + zipname, function(err, data) {

          if(err) {throw err;}// or handle err

          zip = new JSZip(data);

          $.get(tab_file, function(d){
              //removing double quotes
              d = d.replace(/['"]+/g, '').replace(/\s+/g, '\t')
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