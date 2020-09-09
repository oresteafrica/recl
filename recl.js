$(document).on('pagecreate', function (evt,data) {

    var serv = 'http://192.168.0.106/';
    
    var did = app.GetDeviceId();
    var mod = app.GetModel();
    var osv = app.GetOSVersion();

    var dt = new Date();
    var dia = dt.getDate() + '/' + (dt.getMonth()+1)/1 + '/' + dt.getFullYear();
    var agora = dt.getHours() + ':' + dt.getMinutes();
    
    var idade_minima = 21;
    var rad = 1;

    var us_chosen;

    if (app.IsLocationEnabled('GPS')) {
        var loc = app.CreateLocator('GPS');
    } else {
        var loc = app.CreateLocator('Network');
    }
    mapinit(loc);
    
    var err_cadastro = 'Por favor cadastra-se para aceder.';
    var err_idade = 'A sua idade não permite cadastrar.';
    var err_us = 'Por favor indiche a unidade de saúde (US).';

    $('#div_grava_cadastro').html( app.LoadText( 'cadastro', 'nenhuma' ) );
    $('#div_grava_us').html( app.LoadText( 'us', 'nenhuma' ) );

    $('#div_grava_urgencia').html( app.LoadText( 'urgencia', 'nenhuma' ) );
    $('#div_grava_satisfacao').html( app.LoadText( 'satisfacao', 'nenhuma' ) );
    $('#div_grava_servico').html( app.LoadText( 'servico', 'nenhuma' ) );
    $('#div_grava_reclamacao').html( app.LoadText( 'reclamacao', 'nenhuma' ) );
    $('#div_grava_denuncia').html( app.LoadText( 'denuncia', 'nenhuma' ) );
    
    $('#denuncia_data').val( dia );
    $('#denuncia_hora').val( agora );
    $('#reclamacao_i_data').val( dia );

    $('.a_forms').click(function(){
        if ( ! app.LoadBoolean( 'cadastro_ok', false ) ) {app.Alert(err_cadastro); return false;}
        if ( ! app.LoadBoolean( 'idade_ok', false ) ) {app.Alert(err_idade); return false;}
        if ( ! app.LoadBoolean( 'us_ok', false ) ) {app.Alert(err_us); return false;}
        return true;
    });

// choose us ini ---------------------------------------------------------------

    var str_us_chosen = app.LoadText( 'us', '' );
    
    if (str_us_chosen.length > 20) {
        us_chosen = JSON.parse(str_us_chosen);
        $('#denuncia_provus').val(us_chosen[1]);
        $('#denuncia_distrus').val(us_chosen[3]);
        $('#denuncia_nomeus').val(us_chosen[4]);
//        $('#sel_prov').val(us_chosen[0]);
//        $('#prov_'+us_chosen[0]).val(us_chosen[2]);
    }

    $('#a_lista').click(function() {
// mostrare l'us più vicina in lista
        var closeus = closest_us();
        $('#sel_prov').val(closeus[4]);
        $('#prov_' + closeus[4]).val(closeus[0]);
        selnomeus(uss,closeus[0]);
        $('#sel_nomeus option:contains(' + closeus[1] +')').attr('selected', true);
//        $('#sel_prov').prop('disabled', 'disabled');
//        $('.opt_dist').prop('disabled', 'disabled');
    });

    $('.sel_dist').hide();
    var id_prov = $('#sel_prov').children(':selected').attr('id');
    var tx_prov = $('#sel_prov').children(':selected').text();
    var div_id = 'divprov_'+id_prov;
    $('#'+div_id).show();
    
    $('#sel_prov').change(function() {
        $('.sel_dist').hide();
        id_prov = $(this).children(':selected').attr('id');
        tx_prov = $(this).children(':selected').text();
        $('#divprov_'+id_prov).show();
    });
    
    var dist_group = 'prov_' + id_prov;
    var id_dist = $('#'+dist_group).children(':selected').attr('id');
    var tx_dist = $('#'+dist_group).children(':selected').text();

    $('.opt_dist').on('change',function() {
        id_dist = $(this).children(':selected').attr('id');
        tx_dist = $(this).children(':selected').text();
        selnomeus(uss,id_dist);
    });
    
    $('#bu_grava_us').click(function() {
		var vals = [];
        var n_prov = $('#sel_prov').find(":selected").attr('id');
        var nomeus = $('#sel_nomeus').find(":selected").text();
        vals.push( n_prov );
        vals.push( '"' + $('#sel_prov').find(":selected").text() + '"' );
        vals.push( $('#prov_'+n_prov).find(":selected").attr('id') );
        vals.push( '"' + $('#prov_'+n_prov).find(":selected").text() + '"' );
        vals.push( '"' + nomeus + '"' );
		var str_to_send = '[ '+vals.join(', ')+' ]';
        $('#div_grava_us').html( str_to_send );
        app.SaveText('us',str_to_send);
        app.SaveBoolean('us_ok', true);
    });

// choose us end ---------------------------------------------------------------

    $('#bu_grava_cadastro').click(function() {
		var vals = [];
		$('.inp_sexo').each(function() {
		    if ( $(this).is(':checked') ) {
			    sexo =  $(this).val();
		    }
		});
		s_datanasc = $('#inp_datanasc').val();
		idade = getAge(s_datanasc);
		datanasc = new Date(s_datanasc);
		dd_nasc = datanasc.getDate();
		mm_nasc = datanasc.getMonth() + 1;
		yyyy_nasc = datanasc.getFullYear();
		vals.push( sexo )
		vals.push( dd_nasc )
		vals.push( mm_nasc )
		vals.push( yyyy_nasc )
        // check datanasc > = idade_minima
        if (idade >= idade_minima) {
            app.SaveBoolean('idade_ok', true);
        } else {
            app.SaveBoolean('idade_ok', false);
        }
        // [ <space>"sex",<space>dd,<space>mm,<space>yyyy<space>]
		var str_to_send = '[ '+vals.join(', ')+' ]';
        $('#div_grava_cadastro').html( str_to_send );
        app.SaveText('cadastro',str_to_send);
        app.SaveBoolean('cadastro_ok', true);
    });

    $('#bu_grava_urgencia').click(function() {
		var vals = [];
		$('.inp_urgencia').each(function() {
		    if ( $(this).is(':checked') ) {
			    vals.push( $(this).val() );
		    }
		});
		var txt_urgencia = $('#urgencia_25_t').val();
		var str_to_send = '[ '+vals.join(', ')+', "'+txt_urgencia+'" ]';
        $('#div_grava_urgencia').html( str_to_send );
        app.SaveText('urgencia',str_to_send);
    });
    
    $('#bu_grava_satisfacao').click(function() {
		var vals = [];
		$('.inp_satisfacao').each(function() {
		    if ( $(this).is(':checked') ) {
			    vals.push( $(this).val() );
		    }
		});
		var txt_satisfacao = $('#satisfacao_25_t').val();
		var str_to_send = '[ '+vals.join(', ')+', "'+txt_satisfacao+'" ]';
        $('#div_grava_satisfacao').html( str_to_send );
        app.SaveText('satisfacao',str_to_send);
    });

    $('#bu_grava_servico').click(function() {
		var vals = [];
		$('.inp_servico').each(function() {
		    if ( $(this).is(':checked') ) {
			    vals.push( $(this).val() );
		    }
		});
		var txt_servico = $('#servico_25_t').val();
		var str_to_send = '[ '+vals.join(', ')+', "'+txt_servico+'" ]';
        $('#div_grava_servico').html( str_to_send );
        app.SaveText('servico',str_to_send);
    });
/*    
    $('#a_rede').click(function() {
        mapinit(loc);
        return true;
    });
*/
	$('input[type=radio][name=reclamacao_rd]').change(function() {
		reclamacao_rd_set(this.value);
	});
	
    $('#bu_grava_reclamacao').click(function() {
		var vals = [];
		$('.txt_reclamacao').each(function() {
		    vals.push( this.id + ': "' + $(this).val() + '"' );
		});
		$('.num_reclamacao').each(function() {
		    vals.push( this.id + ': ' + $(this).val() );
		});
		$('.date_reclamacao').each(function() {
		    var ddia = new Date( $(this).val() );
            var sdia = ddia.getDate() + '/' + ddia.getMonth() + '/' + ddia.getFullYear();
		    vals.push( this.id + ': "' + sdia + '"' );
		});
		$('.tel_reclamacao').each(function() {
		    vals.push( this.id + ': "' + $(this).val() + '"' );
		});
		$('.email_reclamacao').each(function() {
		    vals.push( this.id + ': "' + $(this).val() + '"' );
		});

        vals.push( 'reclamacao_r_sexo_field: ' + $('input[type=radio][reclamacao_r_sexo_field]').val() );
        vals.push( 'reclamacao_d_sexo_field: ' + $('input[type=radio][reclamacao_d_sexo_field]').val() );
        
		var str_to_send = '{ ' + vals.join(', ') + ' }';
        $('#div_grava_reclamacao').html( str_to_send );
        app.SaveText('reclamacao',str_to_send);
    });


    $('#bu_debug').click(function() {
        $('#div_debug').html( closest_us().join('<br />') );
        return true;
    });
   
    //--------------------------------------------------------------------------
    function reclamacao_rd_set(rd) {
		if (rd==1) {
			$('.reclamacao_r_tr').hide();
		} else {
			$('.reclamacao_r_tr').show();
		}
    }
    //--------------------------------------------------------------------------
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);    
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();    
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    //--------------------------------------------------------------------------
    function mapinit(loc) {
        $('#mapgeo').html('Carregando o mapa, aguarde.');
        loc.SetOnChange(function(data) {
            
            lat = data.latitude;
            lon = data.longitude;
            acc = data.accuracy;
            pro = data.provider;
            app.SaveNumber('lat',lat);
            app.SaveNumber('lon',lon);
            
            var tile01 = [tile_url_01,tile_typ_01];
            
        	if (map == undefined) {
                var container = L.DomUtil.get('mapgeo');
                if(container != null){
                    container._leaflet_id = null;
                }
        	    var map = L.map('mapgeo').setView([lat, lon], 14);

            } else {
                map.off();
                map.remove();
            }

            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            $(".leaflet-control-zoom").css("visibility", "hidden");
            map.dragging.disable();

        	var TileL = L.tileLayer(tile01[0], {
		        id: tile01[1],
		        tileSize: 512,
		        zoomOffset: -1
            }).addTo(map);

	        L.circle([lat, lon], 1000, {
		        color: 'blue',
		        fill: false
	        }).addTo(map);

        	L.circle([lat, lon], 10, {
		        color: 'red',
		        fillColor: '#f03',
		        fillOpacity: 0.5
	        }).addTo(map);
	        
	        uss.forEach(function(e,i) {
	        	if ( (e[2] != 0) && (e[3] != 0) ) {
                    var dist = haversine( lat, lon, e[2], e[3] );
                    if ( dist <= 2 ) {
        			    L.circle([e[2], e[3]], 10, {
		        		    color: 'black',
				            fillColor: 'black',
				            fillOpacity: 0.5
			            }).bindTooltip(e[1], { permanent: true, direction: 'right' }).addTo(map);
		            }
	        	}
	        })	        
	        
            TileL.on('load', function() {

            });
            
            loc.Stop();

        }); // loc.SetOnChange
        loc.SetRate(180); // seconds
	    loc.Start();
    }
    //--------------------------------------------------------------------------
    function haversine() {
        var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
        var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
        // var R = 6371; // earth average radius in km
        var R = 6378; // earth radius at tropic of capricorn in km
        var dLat = lat2 - lat1;
        var dLon = lon2 - lon1;
        var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    }
    //--------------------------------------------------------------------------
    function selnomeus(uss,id_dist) {
        $('#sel_nomeus').empty();
        uss.forEach(function(e,i) {
            if ( e[0] == id_dist ) {
                $('#sel_nomeus').append($('<option>', {
                    text: e[1]
                }));
            }
        });
    }
    //--------------------------------------------------------------------------
    function closest_us() {
        var lat = app.LoadNumber('lat');
        var lon = app.LoadNumber('lon');
        var d1 = 2 * 10 / 10;
        var d2 = 1 * 10 / 10;
        var j = 0;
        uss.forEach(function(e,i) {
    	    if ( (e[2] != 0) && (e[3] != 0) ) {
                d1 = haversine( lat, lon, e[2], e[3] );
                if ( d1 < d2 ) {
                    j = i;
                    d2 = d1;
                }
    	    }
        })
        return uss[j];
    }
    //--------------------------------------------------------------------------
});
