$(document).on('pagecreate', function (evt,data) {
 
    var serv = 'https://sis-ma.in/php/recl.php';
    
    var did = app.GetDeviceId();
    var uem = app.GetUser();
    var mod = app.GetModel();
    var osv = app.GetOSVersion();
    var acs = app.GetAccounts();
    
    var idade_minima = 21;
    
    var err_cadastro = 'Por favor cadastra-se para aceder.';
    var err_idade = 'A sua idade não permite cadastrar.';
    var err_us = 'Por favor indiche a unidade de saúde (US).';

    $('#div_grava_cadastro').html( app.LoadText( 'cadastro', '' ) );
    $('#div_grava_urgencia').html( app.LoadText( 'urgencia', '' ) );
    $('#div_grava_satisfacao').html( app.LoadText( 'satisfacao', '' ) );
    $('#div_grava_servico').html( app.LoadText( 'servico', '' ) );

    $('#a_urgencia').click(function(){
        if ( ! app.LoadBoolean( 'cadastro_ok', false ) ) {app.Alert(err_cadastro); return false;}
        if ( ! app.LoadBoolean( 'idade_ok', false ) ) {app.Alert(err_idade); return false;}
        // check us
        return true;
    });

    $('#a_satisfacao').click(function(){
        if ( ! app.LoadBoolean( 'cadastro_ok', false ) ) {app.Alert(err_cadastro); return false;}
        if ( ! app.LoadBoolean( 'idade_ok', false ) ) {app.Alert(err_idade); return false;}
        // check us
        return true;
    });

    $('#a_servico').click(function(){
        if ( ! app.LoadBoolean( 'cadastro_ok', false ) ) {app.Alert(err_cadastro); return false;}
        if ( ! app.LoadBoolean( 'idade_ok', false ) ) {app.Alert(err_idade); return false;}
        // check us
        return true;
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
		var str_to_send = '{cadastro=['+vals.join(',')+']}';
        $('#div_grava_cadastro').html( str_to_send );
        app.SaveText('cadastro',str_to_send);
        app.SaveBoolean('cadastro_ok', true);
    });

    $('#bu_grava_us').click(function() {
		var vals = [];
        var n_prov = $('#sel_prov').find(":selected").attr('id');
        var nomeus = $('#inp_nomeus').val();
        if (nomeus.length < 5) {app.Alert(err_us); return false;}
        vals.push( n_prov );
        vals.push( $('#sel_prov').find(":selected").text() );
        vals.push( $('#prov_'+n_prov).find(":selected").attr('id') );
        vals.push( $('#prov_'+n_prov).find(":selected").text() );
        vals.push( nomeus );
		var str_to_send = '{us=['+vals.join(',')+']}';
        $('#div_grava_us').html( str_to_send );
        app.SaveText('us',str_to_send);
        app.SaveBoolean('us_ok', true);
    });

    $('#bu_grava_urgencia').click(function() {
		var vals = [];
		$('.inp_urgencia').each(function() {
		    if ( $(this).is(':checked') ) {
			    vals.push( $(this).val() );
		    }
		});
		var txt_urgencia = $('#urgencia_25_t').val();
		var str_to_send = '{urgencia=['+vals.join(',')+','+txt_urgencia+']}';
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
		var str_to_send = '{satisfacao=['+vals.join(',')+','+txt_satisfacao+']}';
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
		var str_to_send = '{servico=['+vals.join(',')+','+txt_servico+']}';
        $('#div_grava_servico').html( str_to_send );
        app.SaveText('servico',str_to_send);
    });
    
    
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
    

});
