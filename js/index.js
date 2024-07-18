document.addEventListener('DOMContentLoaded', function() {

    let historial = JSON.parse(localStorage.getItem('historial')) || [];
    function guardarHistorial() {
        localStorage.setItem('historial', JSON.stringify(historial));
    }

    async function calcularPagoMensual(monto, tasaInteres, numeroCuotas) {
        const tasaMensual = tasaInteres / 100 / 12;
        let potencia = 1;
        for (let i = 0; i < numeroCuotas; i++) {
            potencia *= (1 + tasaMensual);
        }
        const denominador = 1 - (1 / potencia);
        const pagoMensual = monto * tasaMensual / denominador;
        const pagoMensualRedondeado = ((pagoMensual * 100) + 0.5) | 0;
        return pagoMensualRedondeado / 100;
    }

    async function mostrarCuotas(pagoMensual, numeroCuotas) {
        let detalles = `Detalles de Pagos:\n`;
        for (let i = 1; i <= numeroCuotas; i++) {
            detalles += `Cuota ${i}: $${pagoMensual}\n`;
        }
        return detalles;
    }

    async function mostrarResultados(pagoMensual, numeroCuotas) {
        const detalles = await mostrarCuotas(pagoMensual, numeroCuotas);
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>El pago mensual es: $${pagoMensual}</p><pre>${detalles}</pre>`;
    }

    async function agregarAlHistorial(monto, tasaInteres, numeroCuotas, pagoMensual) {
        const calculo = {
            monto,
            tasaInteres,
            numeroCuotas,
            pagoMensual,
            fecha: new Date().toLocaleString()
        };
        historial.push(calculo);
        guardarHistorial();
        actualizarHistorial();
        Swal.fire({
            icon: 'success',
            title: 'Cálculo Agregado🚀',
            text: `Monto: $${monto}, Tasa de Interés: ${tasaInteres}%, Cuotas: ${numeroCuotas}, Pago Mensual: $${pagoMensual}`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }

    function actualizarHistorial() {
        const historialDiv = document.getElementById('historial');
        historialDiv.innerHTML = '';
        historial.forEach((calculo, index) => {
            historialDiv.innerHTML += `<div>
                <strong>Calculo ${index + 1}:</strong> 
                Monto: $${calculo.monto}, 
                Tasa de Interés: ${calculo.tasaInteres}%, 
                Cuotas: ${calculo.numeroCuotas}, 
                Pago Mensual: $${calculo.pagoMensual}, 
                Fecha: ${calculo.fecha}
            </div>`;
        });
    }

    document.getElementById('formulario').addEventListener('submit', async function(event) {
        event.preventDefault();
        const monto = parseFloat(document.getElementById('monto').value);
        const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value);
        const tasaInteres = parseFloat(document.getElementById('tasaInteres').value);

        if (isNaN(monto) || isNaN(numeroCuotas) || isNaN(tasaInteres) || monto <= 0 || numeroCuotas <= 0 || tasaInteres < 0) {
            alert("Por favor, ingrese valores válidos.");
        } else {
            const pagoMensual = await calcularPagoMensual(monto, tasaInteres, numeroCuotas);
            await mostrarResultados(pagoMensual, numeroCuotas);
            await agregarAlHistorial(monto, tasaInteres, numeroCuotas, pagoMensual);
        }
    });

    document.getElementById('buscar').addEventListener('click', function() {
        const montoBuscado = parseFloat(document.getElementById('buscarMonto').value);
        const historialDiv = document.getElementById('historial');
        historialDiv.innerHTML = '';
        historial.filter(calculo => calculo.monto === montoBuscado).forEach((calculo, index) => {
            historialDiv.innerHTML += `<div>
                <strong>Calculo ${index + 1}:</strong> 
                Monto: $${calculo.monto}, 
                Tasa de Interés: ${calculo.tasaInteres}%, 
                Cuotas: ${calculo.numeroCuotas}, 
                Pago Mensual: $${calculo.pagoMensual}, 
                Fecha: ${calculo.fecha}
            </div>`;
        });
    });

    document.getElementById('borrarHistorial').addEventListener('click', function() {
        historial = [];
        guardarHistorial();
        actualizarHistorial();
    });
    async function mostrarValorDolar() {
        const respuesta = await fetch('https://dolarapi.com/v1/dolares');
        const data = await respuesta.json();
        const dolarDiv = document.getElementById('valorDolarHoy');
        dolarDiv.innerHTML = data.map(dolar => `
            <div class="dolar-item">
                <span class="dolar-title">${dolar.nombre}</span>
                <div class="dolar-value">
                    <span>Compra: $${dolar.compra}</span>
                    <span>Venta: $${dolar.venta}</span>
                </div>
            </div>
        `).join('') + `
            <div class="dolar-source">
                Datos obtenidos de <a href="https://dolarapi.com" target="_blank" style="color: #5DADE2;">DolarApi.com</a>
            </div>
            <div class="dolar-update">
                Actualizado el ${new Date(data[0].fechaActualizacion).toLocaleString()}
            </div>
        `;
    }

    mostrarValorDolar();
    actualizarHistorial();
});
