// common partner functions
// =========================


// make history list body
// -----------------------
cur_frm.cscript.make_hl_body = function(){
	cur_frm.fields_dict['History HTML'].wrapper.innerHTML = '';
	cur_frm.history_html = $a(cur_frm.fields_dict['History HTML'].wrapper,'div');
}


// make history
// -------------
cur_frm.cscript.make_history = function(doc,dt,dn){
	cur_frm.history_html.innerHTML = '';
	cur_frm.cscript.make_history_list(cur_frm.history_html,doc);
}

// make history list
// ------------------
cur_frm.cscript.make_history_list = function(parent,doc){

	var sel = $a(parent,'select');
	
	var ls = ['Select Transaction..'];
	for(d in cur_frm.history_dict){
		ls.push(d);
	}
	
	add_sel_options(sel,ls,'Select..');
	
	var body = $a(parent,'div');
	body.innerHTML = '<div class="help_box">Please select a transaction type to see History</div>';
	
	sel.body = body;
	sel.doc = doc;
	
	sel.onchange = function(){
		for(d in cur_frm.history_dict){
			if(sel_val(this) == d){
				this.body.innerHTML = '';
				eval(cur_frm.history_dict[d]);
				return;
			}
			else{
				// pass
			}
		}
	}
}

// run list
// ---------
cur_frm.cscript.run_list = function(lst,parent,q,q_max,doc,dn,nm){
	
	parent.innerHTML = '';
	$dh(parent);
	
	lst.doc = doc;
	lst.dn = dn;
	lst.nm = nm;
	lst.page_len = 10;
	
	lst.get_query = function(){
		this.query = q;
		this.query_max = q_max;
	}
	
	lst.make(parent);
	lst.run();
	
	lst.onrun = function(){
		$ds(parent);
		if(!this.has_data()){
			parent.innerHTML = '';
			var dv = $a(parent,'div','help_box');
			$a(dv,'span').innerHTML = "No " + this.dn + " found. ";
			
			var lbl = 'Create the <b>first</b> ' + this.dn + ' for ' + this.doc.name;
			var sp = $a(dv,'span');
			sp.nm = this.nm;
			$(sp).html(lbl).addClass('link_type').click(function(){ newdoc(this.nm); });
		}
	}
}


// get sates on country trigger
// -----------------------------
cur_frm.cscript.get_states=function(doc,dt,dn){
   $c('runserverobj', args={'method':'check_state', 'docs':compress_doclist([doc])},
    function(r,rt){
      if(r.message) {
        set_field_options('state', r.message);
      }
    }  
  );

}

cur_frm.cscript.country = function(doc, dt, dn) {
  cur_frm.cscript.get_states(doc, dt, dn);
}

// territory help - cutsomer + sales partner
// -----------------------------------------
cur_frm.cscript.TerritoryHelp = function(doc,dt,dn){
  var call_back = function(){

    var sb_obj = new SalesBrowser();        
    sb_obj.set_val('Territory');
  }
  loadpage('Sales Browser',call_back);
}

// get query select Territory
// ---------------------------
if(cur_frm.fields_dict['territory']){
	cur_frm.fields_dict['territory'].get_query = function(doc,dt,dn) {
		return 'SELECT `tabTerritory`.`name`,`tabTerritory`.`parent_territory` FROM `tabTerritory` WHERE `tabTerritory`.`is_group` = "No" AND `tabTerritory`.`docstatus`!= 2 AND `tabTerritory`.%(key)s LIKE "%s"  ORDER BY  `tabTerritory`.`name` ASC LIMIT 50';
	}
}