document.addEventListener('DOMContentLoaded', function() {
    // Historial de cálculos
    let historial = [];

    function calcularPagoMensual(monto, tasaInteres, numeroCuotas) {
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

    function mostrarCuotas(pagoMensual, numeroCuotas) {
        let detalles = `Detalles de Pagos:\n`;
        for (let i = 1; i <= numeroCuotas; i++) {
            detalles += `Cuota ${i}: $${pagoMensual}\n`;
        }
        return detalles;
    }


    function mostrarResultados(pagoMensual, numeroCuotas) {
        const detalles = mostrarCuotas(pagoMensual, numeroCuotas);
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>El pago mensual es: $${pagoMensual}</p><pre>${detalles}</pre>`;
    }

    // Función para agregar un cálculo al historial
    function agregarAlHistorial(monto, tasaInteres, numeroCuotas, pagoMensual) {
        const calculo = {
            monto,
            tasaInteres,
            numeroCuotas,
            pagoMensual,
            fecha: new Date().toLocaleString()
        };
        historial.push(calculo);
        actualizarHistorial();
    }

    // Función para actualizar el historial en la interfaz
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

    // Manejar el envío del formulario y calcular los resultados
    document.getElementById('formulario').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const monto = parseFloat(document.getElementById('monto').value);
        const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value);
        const tasaInteres = parseFloat(document.getElementById('tasaInteres').value);

        if (isNaN(monto) || isNaN(numeroCuotas) || isNaN(tasaInteres) || monto <= 0 || numeroCuotas <= 0 || tasaInteres < 0) {
            alert("Por favor, ingrese valores válidos.");
        } else {
            
            const pagoMensual = calcularPagoMensual(monto, tasaInteres, numeroCuotas);
            
            mostrarResultados(pagoMensual, numeroCuotas);
            
            agregarAlHistorial(monto, tasaInteres, numeroCuotas, pagoMensual);
        }
    });

    // Función para buscar en el historial
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
});
