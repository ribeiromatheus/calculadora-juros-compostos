$(document).on('change', '.dataput', function () {
    let prazoAno = $('.prazoAno').val(),
        vencem = $('.ateVencer').val();
    if (vencem) {
        let compDateParse = Date.parse(vencem);
        console.log(compDateParse);

        let currentDate = new Date();
        let currentParse = Date.parse(currentDate);
        console.log(currentParse);

        let daysDiff = (compDateParse - currentParse) / (1000 * 60 * 60 * 24 * 30);
        $('.prazo').val(daysDiff.toFixed(2));
    } else if (prazoAno)
        $('.prazo').val((parseFloat(prazoAno) * 12).toFixed(2));
})
    .on('change', '.taxaAno', function () {
        let taxaobj = $('.taxa');
        let taxaAno = $('.taxaAno').val() * 1;
        taxaobj.val(((Math.pow((taxaAno / 100 + 1), (1 / 12)) - 1) * 100).toFixed(2));
    })
    .on('click', '.simulaUm', function () {
        /* formatadores */
        Number.prototype.praPessoa = function (c, d, t) {
            let n = this, s, i, j;
            c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? ',' : d,
                t = t == undefined ? '.' : t,
                s = n < 0 ? '-' : '',
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
                j = (j = i.length) > 3 ? j % 3 : 0;

            return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
        }

        jQuery('.resultados').show();
        jQuery('html, body');

        let montante = parseFloat(jQuery('.montante').val() * 1),
            aporte = parseFloat(jQuery('.aporte').val() * 1),
            prazo = parseFloat(jQuery('.prazo').val() * 1),
            taxa = parseFloat(jQuery('.taxa').val()) / 100;

        /* Arrays para gráfico */
        let dados = [],
            dadosjuros = [],
            dadosAportes = [];
        dados.push([0, montante]);
        dadosjuros.push([0, 0]);
        dadosAportes.push([0, montante]);

        /* Cálculo Mensal */
        let jurosout = 0,
            acumulado,
            acuPush = 0,
            aportePush = 0,
            jurosPush = 0,
            tempJuros = 0;
        acuPush = montante;

        /* formação da tabela */
        acumulado = '<tr><td>0</td><td>' +
            Number(montante).praPessoa() +
            '</td><td>0</td><td>0</td><td>' +
            Number(montante).praPessoa() +
            '</td></tr>';
        for (let i = 1; i <= prazo; i++) {
            /* pega acumulado do mês passado e aplica juros */
            tempJuros = parseInt(acuPush * taxa * 100) / 100;
            acuPush = Math.floor((acuPush + parseInt((tempJuros + aporte) * 100) / 100) * 100) / 100;
            console.log('anterior: ' + acuPush + ' juros: ' + tempJuros + ' aporte ' + aporte);
            dados.push([i, acuPush]);

            /* calcula acumulado de aportes */
            aportePush = montante + aporte * i;
            dadosAportes.push([i, aportePush]);

            /* calcula os juros acumulados */
            jurosPush = Math.floor(parseFloat(acuPush - aportePush).toFixed(2) * 100) / 100;
            dadosjuros.push([i, jurosPush]);

            /* incrementa tabela */
            acumulado += '<tr><td>' + i + '</td><td>' + Number(aportePush).praPessoa() + '</td><td>' + Number(tempJuros).praPessoa() + '</td><td>' + Number(jurosPush).praPessoa() + '</td><td>' + Number(acuPush).praPessoa() + '</td></tr>';
        }
        if (prazo === parseInt(prazo))
            console.log('inteiro');
        // else {
        //     acuPush = (montante * Math.pow((1 + taxa), prazo)).toFixed(2);
        //     dados.push([prazo, acuPush]);
        //     acumulado += '<tr><td>' + prazo + '</td><td>'+ acuPush +'</td></tr>';
        // }

        /* imprime resultados */
        jQuery('.apIn').text(Number(montante).praPessoa());
        jQuery('.apOut').text(Number(montante + aporte * prazo).praPessoa());
        jQuery('.apJu').text(Number(jurosPush).praPessoa());
        jQuery('.apTot').text(Number(acuPush).praPessoa());
        console.log(dados);
        console.log(acumulado);
        jQuery('#printfinal').find('tbody').html(acumulado);
        /* gera grafico */
        // let line_cresce = { label: 'Acumulado', data: dados, color: '#3c8dbc' };
        // let aporte_cresce = { label: 'Investimento', data: dadosAportes, color: '#ff3333' };
        // let juros_cresce = { label: 'Juros', data: dadosjuros, color: '#47d147' };
        /* ajusta legenda*/
        // jQuery('<div id='ctooltip'></div>').css({ position: 'absolute', display: 'none', border: '1px solid #fdd', padding: '2px', 'background-color': '#fee', opacity: 0.80 }).appendTo('body');
        // jQuery('#cresce-chart').bind('plothover', function (event, pos, item) {
        //     let str = '(' + pos.x.toFixed(2) + ', ' + pos.y.toFixed(2) + ')';
        //     $('#hoverdata').text(str); if (item) {
        //         let x = item.datapoint[0].toFixed(0), y = item.datapoint[1].toFixed(2); jQuery('#ctooltip').html(item.series.label + ' de ' + y + ' no mês ' + x).css({ top: item.pageY + 5, left: item.pageX + 5 }).fadeIn(200);
        //     } else {
        //         $('#ctooltip').hide();
        //     }
        // });
    });