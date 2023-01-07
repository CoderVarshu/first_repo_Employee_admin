$(document).ready(function(){

    $.getJSON("http://localhost:3000/employee/fetchstates",function(data){
          //alert(JSON.stringify(data))
          data.result.map((item)=>{
             $('#inputState').append($('<option>').text(item.statename).val(item.sid))

          })
         })
         $('#inputState').change(function(){
            $.getJSON("http://localhost:3000/employee/fetchcities",{"sid":$('#inputState').val()},
            function(data){
                $('#inputCity').empty()
                $('#inputCity').append($('<option>').text('Choose city'))
                data.result.map((item)=>{
                    $('#inputCity').append($('<option>').text(item.cityname).val(item.cid))
                })


            })


         })

})