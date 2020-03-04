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

Calculator = {};
Calculator.Initialize = function () {
    Calculator.AddDimensionsWall();
    Calculator.AddDimensionsDoorWindow("Window", "janela");
    Calculator.AddDimensionsDoorWindow("Door", "porta")
};
Calculator.DimensionsWallIndex = 99999;
Calculator.DimensionsDoorWindowIndex = 99999;
Calculator.Result = "";
Calculator.ShowFirstStep = function () {
    $("#divCalculatorFirstStep").show();
    $("#divCalculatorSecondStep").hide()
};
Calculator.ShowSecondStep = function () {
    $("#divCalculatorFirstStep").hide();
    $("#divCalculatorSecondStep").show();
    $("button.go-to-top").click()
};
Calculator.Change = function () {
    $("#divCalculatorFirstStep").show();
    $("#divCalculatorSecondStep").hide()
};
Calculator.Calculate = function () {
    var s = [],
        h = [],
        c = 0,
        l = $("input[name=surfaceType]").is(":checked"),
        u, f, e, o, t;
    if (l && (c = $("input[name=surfaceType]:checked").val()), u = $("#dropTypePaint").val(), f = $("#dropHands").val(), !l) {
        MessageBox.Show("Erro!", 'Selecione uma opção para o campo "Tipo de Superfície"!');
        return
    }
    if (String.IsNullOrEmpty(u) || u == "-1") {
        MessageBox.Show("Erro!", 'Selecione uma opção para o campo "Tipo de produto"!');
        return
    }
    if (e = $("input[name=hdnDimensionsWallIndex]"), e.length == 0) {
        MessageBox.Show("Erro!", 'Preencha uma opção para o campo "Dimensões a ser pintada"!');
        return
    }
    for (t = 0; t < e.length; t++) {
        var n = e[t].value,
            i = parseFloat($("#txtHeight_" + n).val().replace(",", ".")),
            r = parseFloat($("#txtWidth_" + n).val().replace(",", "."));
        if (!Validator.IsDecimal($("#txtHeight_" + n).val()) || i == 0) {
            MessageBox.Show("Erro!", 'Valor informado para o campo "Altura da dimensão a ser pintada" inválido!');
            return
        }
        if (!Validator.IsDecimal($("#txtWidth_" + n).val()) || r == 0) {
            MessageBox.Show("Erro!", 'Valor informado para o campo "Largura da dimensão a ser pintada" inválido!');
            return
        }
        s.push({
            Height: i,
            Width: r
        })
    }
    for (o = $("input[name=hdnDimensionsDoorWindowIndex]"), t = 0; t < o.length; t++) {
        var n = o[t].value,
            i = parseFloat($("#txtHeightDoorWindow_" + n).val().replace(",", ".")),
            r = parseFloat($("#txtWidthDoorWindow_" + n).val().replace(",", "."));
        if (i != 0 && Validator.IsDecimal($("#txtHeightDoorWindow_" + n).val()) || r != 0 && Validator.IsDecimal($("#txtWidthDoorWindow_" + n).val())) {
            if (!Validator.IsDecimal($("#txtHeightDoorWindow_" + n).val()) || i == 0) {
                MessageBox.Show("Erro!", 'Valor informado para o campo "Altura da Porta / Janela" inválido!');
                return
            }
            if (!Validator.IsDecimal($("#txtWidthDoorWindow_" + n).val()) || r == 0) {
                MessageBox.Show("Erro!", 'Valor informado para o campo "Largura da Porta / Janela" inválido!');
                return
            }
            h.push({
                Height: i,
                Width: r
            })
        }
    }
    if (String.IsNullOrEmpty(f) || f == "-1") {
        MessageBox.Show("Erro!", 'Selecione uma opção para o campo "Número de demão"!');
        return
    }
    Ajax.Callback.Calculate(c, u, f, s, h, Calculator.Calculate_End)
};
Calculator.Calculate_End = function (n) {
    n = n || {
        Surface: "",
        TypePaint: "",
        TotalMetersSurface: "",
        TotalMetersEnd: "",
        TotalMetersDecrease: "",
        Quantity: "",
        QuantityLargeCan: "",
        QuantityMediumCan: "",
        QuantitySmallCan: ""
    };
    Calculator.Result = n;
    $("#spanSurface").html(n.Surface);
    $("#spanProduct").html(n.TypePaint);
    $("#spanTotalMeters").html(String.Format("{0} m²", n.TotalMetersSurface.ToString("0.##")));
    $("#spanMetersEnd").html(String.Format("{0} m²", n.TotalMetersEnd.ToString("0.##")));
    $("#spanDimensionsDoorWindow").html(String.Format("{0} m²", n.TotalMetersDecrease.ToString("0.##")));
    $("#spanQuantity").html(String.Format("{0} litros", n.Quantity.ToString("0.##")));
    $("#spanQuantityPackage").html(String.Format("{0} lata(s)", n.QuantityLargeCan));
    Calculator.ShowSecondStep();
    Calculator.Result.QuantitySmallCan == 1 ? Calculator.ChangeTypePaintCan(3, "small-can") : Calculator.Result.QuantityMediumCan == 1 ? Calculator.ChangeTypePaintCan(2, "medium-can") : Calculator.ChangeTypePaintCan(1, "large-can")
};
Calculator.ChangeTypePaintCan = function (n, t) {
    var i = 0;
    i = n == 1 ? Calculator.Result.QuantityLargeCan : n == 2 ? Calculator.Result.QuantityMediumCan : Calculator.Result.QuantitySmallCan;
    $("#spanQuantityPackage").html(String.Format("{0} lata(s)", i));
    $("#ulTypePaintCan li").removeClass("active");
    $("#" + t).addClass("active")
};
Calculator.Recalculate = function () {
    $("input:text").val("");
    $("input[type=radio]").removeAttr("checked");
    $("#dropTypePaint").html("");
    $("#dropHands").val("-1");
    Calculator.ShowFirstStep()
};
Calculator.GetTypePaints = function (n) {
    $("#dropTypePaint").empty();
    $("#dropTypePaint").prop("disabled", !1);
    Ajax.Callback.GetTypePaints(n, Calculator.GetTypePaints_End)
};
Calculator.GetTypePaints_End = function (n) {
    var i, t;
    for (n = n || {
        TypePaints: []
    }, i = "", n.TypePaints.length > 1 && (i += '<option value="-1">Selecione o produto<\/option>'), t = 0; t < n.TypePaints.length; t++) i += String.Format('<option value="{0}">{1}<\/option>', n.TypePaints[t].Id, n.TypePaints[t].Name);
    $("#dropTypePaint").append(i);
    n.TypePaints.length <= 1 && $("#dropTypePaint").prop("disabled", "disabled")
};