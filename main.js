let expendArray = [];
let cash;

/* Boton de Calcular */
$('#btnBudget').click(function (event) {
    event.preventDefault()
    cash = saveBudget()
    showMoney(cash)
    unBlock(cash)
})

/* Boton de Añadir Gasto */
$('#btnExpend').click(function (event) {
    event.preventDefault()
    let expend = saveExpends()
    sumExpends(expend)
    addListItems(expend)
})


/* Funcion que desbloquea la tabla expendures*/
const unBlock = (cash) => {
    if (cash > 0) {
        $('#expendures').removeAttr('disabled')
    }
}

/* Clase para crear objetos de gastos y monto */
class Expends {
    constructor(name, amount) {
        this.name = name
        this.amount = amount
    }
}

/* Función para validar que solo sean numeros y no otros caracteres en el formulario Presupuesto */
function saveBudget() {
    let budgetLock = $('#budget').val()
    if (!/[\D]/gm.test(budgetLock) && budgetLock != '' && budgetLock > 0) {
        let budget = parseInt(budgetLock)
        $('#budget').val('')
        return budget
    } else {
        alert('Por favor ingrese solo numeros')
        $('#budget').val('')
        return 0
    }
}

/* Muestra saldo diponible */
const showMoney = (cash = 0) => {
    if (cash >= 0) {
        $('#cash').text(`$${cash.toLocaleString()}`)
        $('#finalCash').text(`$${cash.toLocaleString()}`)
    }
}

/* Valida el nombre y valores de los gastos, donde el monto solo debe ser numero, y no otro caracter */
const saveExpends = () => {
    let nameExpLock = $('#nameExpend').val();
    let amntExpLock = $('#amountExpend').val();
    if (!/[\D]/gm.test(amntExpLock) && amntExpLock != '' && nameExpLock != '') {
        let objExpend = new Expends(nameExpLock, amntExpLock);
        expendArray.push(objExpend)
        $('#amountExpend').val('') && $('#nameExpend').val('')
        return expendArray
    } else {
        alert('Por favor ingrese un producto junto a un monto valido sin puntos ni comas en los espacios indicados')
        $('#amountExpend').val('') && $('#nameExpend').val('')
        return
    }
}

/* Función que agrega los datos de gastos hacia la tabla de gastos y crea el boton de trash */
const addListItems = (expend) => {
    $('#tBody').html('')
    expend.forEach(item => {
        $('#tBody').append(`
            <tr>
                <td>${item.name}</td>
                <td>$${(item.amount).toLocaleString()}</td>
                <td><button class="trash border-0"><i class="fa-solid fa-trash-can"></button></i></td>
            </tr>
        `)
    })
}

/* Boton Eliminar con emotion TRASH*/
$('#tBody').on('click', '.trash', function () {
    $(this).parent().parent().remove()
    deleteItem($(this).parent().prev().prev().text())
    subExpends()
});

/* Borra elementos del array */
const deleteItem = (product) => {
    expendArray = expendArray.filter(item => {
        if (item.name != product) {
            return item
        }
    })
}

/* Suma de los gastos y presupuesto, donde cambia de color si es negativo */
const sumExpends = (expend) => {
    let expendsTotal = [];
    let total;
    expend.forEach(item => {
        expendsTotal.push(item.amount)
        total = expendsTotal.reduce((a, b) => {
            return parseInt(a) + parseInt(b)
        })
    })
    $('#sumExpend').text(`$${(total).toLocaleString()}`)
    if(cash - total >= 0){
        $('#finalCash').text(`$${(cash - total).toLocaleString()}`)
    }else{
        $('#finalCash').text(`$${(cash - total).toLocaleString()}`).css('color', 'red')
    }
}

/* Esta funcion suma los gastos eliminados de la tabla gastos para mostrar los datos actualizados. */
const subExpends = () => {
    let expendsTotal = [];
    let total;
    if (expendArray.length >= 1) {
        expendArray.forEach(item => {
            expendsTotal.push(item.amount)
            total = expendsTotal.reduce((a, b) => {
                return parseInt(a) + parseInt(b)
            })
        })
        $('#sumExpend').text(`$${(total).toLocaleString()}`)
        if(cash - total >= 0){
            $('#finalCash').text(`$${(cash - total).toLocaleString()}`).css('color', 'black')
        }else{
            $('#finalCash').text(`$${(cash - total).toLocaleString()}`).css('color', 'red')
        }
    } else {
        $('#sumExpend').text(0).toLocaleString()
        $('#finalCash').text(`$${(cash).toLocaleString()}`)

    }
}