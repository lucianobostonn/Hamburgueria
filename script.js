const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cartBtn")
const cartContainer = document.getElementById("cartContainer")
const cartPedidos = document.getElementById("cartPedidos")
const cartTotal = document.getElementById("cartTotal")
const pedir = document.getElementById("pedir")
const closeCartContainer = document.getElementById("closeContainer")
const cartCount = document.getElementById("cartCount")
const enderecoInput = document.getElementById("iendereço")
const msgWarn = document.getElementById("msgWarn")

var carrinho = []

cartBtn.addEventListener("click", function() {
    cartContainer.style.display = "flex"
    cartView()
})

closeCartContainer.addEventListener("click", function() {
    cartContainer.style.display = "none"
})

cartContainer.addEventListener("click", function(e) {
    if(e.target === cartContainer){
        cartContainer.style.display = "none"
    }
    
})


menu.addEventListener("click", function(e){

    var parentButton = e.target.closest(".cart-plusBtn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        //Adicionar no carrinho
        adToCart(name, price)
    }
})



//Função para adicionar no carrinho
function adToCart(name, price){
    const itemExists = carrinho.find((e)=> e.name === name)
    if(itemExists){
        itemExists.quantidade += 1
    }
    else{
        carrinho.push({
            name,
            price,
            quantidade: 1
        })
    }
    

    cartView()

}



function cartView(){
    cartPedidos.innerHTML = ""
    var total = 0

    carrinho.forEach((i, index) => {
        const div = document.createElement("div")
        const button = document.createElement("div")
        const div2 = document.createElement("div")
        div.classList.add("pedido")
        const name = document.createElement("p")
        const quantidade = document.createElement("p")
        const preco = document.createElement("p")
        name.style.fontWeight = "bold"

        button.innerText = "Remover"
        button.style.cursor = "pointer"
        button.addEventListener("click", function(){
            i.quantidade = i.quantidade - 1
            if(i.quantidade <= 0){
                carrinho.splice(index, 1)
            }

            return cartView()
        })
        name.innerHTML = i.name
        quantidade.innerHTML = `(Quantidade: ${i.quantidade})`
        preco.innerHTML = `${i.price},00kz`
        
        div.appendChild(name)
        div.appendChild(quantidade)
        div.appendChild(preco)

        div2.appendChild(div)
        div2.appendChild(button)
        div2.classList.add("pedidoContainer")
        
        cartPedidos.appendChild(div2)

        total+= parseFloat(i.price) * parseFloat(i.quantidade)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "AOA"
    })

    cartCount.innerHTML = carrinho.length

}


enderecoInput.addEventListener("input", function(e){
    var inputValue = e.target.value

    if(inputValue !== ""){
        msgWarn.style.display = "none"
        enderecoInput.style.border = "2px solid #0000001a"
    }

})

//Finalizar pedido
pedir.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "O Restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "#ff3131",
            },
        }).showToast()

        return;
    }

    if(carrinho.length === 0){
        return window.alert("O seu carrinho está vazio")
    }
    if(enderecoInput.value === ""){
        msgWarn.style.display = "block"
        enderecoInput.style.border = "2px solid red"
        return
    }


    //Enviar o pedido para o WhatsApp
    const cartItems = carrinho.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantidade})  Preço: ${item.price},00kz |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "244949566947"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${enderecoInput.value}`, "_blank")

    carrinho = []
    cartView()
    
})




function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 12 && hora < 22
}


const spanItem = document.getElementById("hourInfo")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.style.backgroundColor = "#54cc0a"
    
}
else{
    spanItem.style.backgroundColor = "#ff3131"
}