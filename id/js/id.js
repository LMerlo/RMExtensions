var identified_artifacts = ["Condizione applicativa","Contromisura","Hazard","Requisito input","Requisito hardware","Requisito sistema","Requisito software","Requisito sottosistema","Test"];
var identifiers = ["Identificativo Condizione Applicativa","Identificativo Contromisura","Identificativo Hazard","Identificativo UN","Identificativo Hardware","Identificativo ERIS","Identificativo Software","Identificativo Sottosistema","Identificativo Test"];
var prefixes = ["","CM_","HZ_","UN_","","","","",""];
var initialize = true;
var counters = [0,0,0,0,0,0,0,0,0];

function version()
{
	window.alert("prova 8");
	initialize=false;
}

function println(string,element) {
	var p = document.createElement("p");
	p.innerHTML = string;
	$(p).appendTo("#"+element);
};

$(function()
{
	//if (initialize==true) version();
	
	var selection = [];
	var docName = "";
	println("Entrare in un modulo per aggiornare gli identificativi","intro");
	RM.Event.subscribe(RM.Event.ARTIFACT_OPENED, function(selected) {
		$("#progress").empty();
		selection = selected;
		RM.Data.getContentsAttributes(selection, identifiers, function(result3){
			result3.data.forEach(function(item3){
				for(var i = 0; i < counters.length;i++)
				{
			 		//window.alert("counter ["+i+"]="+counters[i]+":"+identifiers[i]);
				 	var oldid = item3.values[identifiers[i]];
					var num = 0;
					//window.alert(oldid+" "+prefixes[i]);
					if (oldid==undefined) oldid="";
					if(oldid.includes(prefixes[i]) && oldid.length>5) num=parseInt(oldid.slice(-4));
					//window.alert("counter "+counters[i]+" num "+num);
					if(isNaN(num)) {window.alert("Number error");}
					else if (num>counters[i]) counters[i]=num;
				}
			});
		});
		
		RM.Data.getAttributes(selection, [RM.Data.Attributes.NAME,RM.Data.Attributes.FORMAT], function(result4){			
			result4.data.forEach(function(item4){
				if (item4.values[RM.Data.Attributes.FORMAT] === RM.Data.Formats.MODULE)
				{
					$("#intro").empty();
					println("Modulo: <b>"+item4.values[RM.Data.Attributes.NAME]+"</b>","intro");
					docName=item4.values[RM.Data.Attributes.NAME]+"_";
				}
			});
		});
	});
	
  $("#SetID").on("click", function() {
	  
      $("#progress").empty();
      $("#progress2").empty();
      //window.alert("start function");
	  
      RM.Data.getContentsAttributes(selection, identifiers.concat([RM.Data.Attributes.ARTIFACT_TYPE]), function(result){
	      
      if(result.code !== RM.OperationResult.OPERATION_OK)
      {
	 window.alert("Error: " + result.code);
         return;
      }
      
      // Store any required attribute changes here
      var toSave = [];
      //window.alert("get attributes");
      var number=0;
       // Go through artifact data examining artifact type
      result.data.forEach(function(item){
	 number++;
	 println("Attendere...","progress");
	 println("Elaborazione: <b>"+number+"/"+result.data.length+"</b>","progress");
         var type = item.values[RM.Data.Attributes.ARTIFACT_TYPE].name;
         //window.alert(type);
         var newid = "";
	 var n = -1;
	 for (var i = 0; i < counters.length; i++)
	 {
		 //window.alert(identified_artifacts[i]+" vs "+type);
		 if(identified_artifacts[i].includes(type)) n=i; //window.alert("found: "+i);
	 }
	 if(n!=-1)
	 {
		 
            if (item.values[identifiers[n]]==null || !(item.values[identifiers[n]].includes(prefixes[n])  && item.values[identifiers[n]].length>7))
	    {
		var counter = counters[n]+1;
		newid = prefixes[n]+docName+('0000'+counter).slice(-4);
	    	//window.alert(newid);
	    	item.values[identifiers[n]] = newid;
		counters[n]++;
            	toSave.push(item);
	    }
	 }
      });
      // Perform a bulk save for all changed attributes
      var number2=0;
      RM.Data.setAttributes(toSave, function(result2){
	 result2.data.forEach(function(item2){
		 number2++;
		 println("Attendere...","progress2");
		 println("Salvataggio: <b>"+number2+"/"+result2.data.length+"</b>","progress2");
	 });
         if(result2.code !== RM.OperationResult.OPERATION_OK)
         {
            window.alert("Error: " + result2.code);
         }
      println("\nFINITO","progress2");
      });
   });
});
});






