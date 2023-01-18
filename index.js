const d = document,
$contenedorCards = d.querySelector('.contenedor-productos'),
$btnCart = d.querySelector('.cart-container'),
$cartNumber = d.querySelector('.cart-number'),
$modalCart = d.querySelector('.modal-cart'),
$table = d.querySelector('.modal-cart-items'),
$xMark = d.querySelector('.fa-xmark'),
$cartEmpty = d.querySelector('.modal-cart-empty'),
$total = d.getElementById('total'),
$btnVaciar = d.getElementById('btn-vaciar'),
$btnComprar = d.getElementById('btn-comprar'),
$cartelCompra = d.querySelector('.cartel-compra-fondo'),
$btnYes = d.getElementById('si'),
$btnNo = d.getElementById('no');

$btnCart.addEventListener('click', () => {
    $modalCart.classList.add('show');
});

$btnVaciar.addEventListener('click', ()=> {
    $table.innerHTML = `
    <tr>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th></th>
    </tr>`;
    $total.textContent = 0;
    $cartNumber.textContent = 0
});

$btnComprar.addEventListener('click',()=>{
    $cartelCompra.classList.add('d-flex');
})

$btnNo.addEventListener('click',()=> {
    $cartelCompra.classList.remove('d-flex');
})

$btnYes.addEventListener('click', ()=>{
    $cartelCompra.classList.remove('d-flex');
    $table.innerHTML = `
    <tr>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th></th>
    </tr>`;
    $total.textContent = '0'
})

$xMark.addEventListener('click', (e)=>{
    e.stopPropagation();
    $modalCart.classList.remove('show');
})

function asignCardsEvents(nodelist){
    nodelist.forEach(nodo => {
        const btn = nodo.querySelector('button');
        const name = nodo.querySelector('h2').textContent;
        const price = parseFloat(nodo.querySelector('.card-price strong').textContent);
        const id = nodo.getAttribute('data-id');

        btn.addEventListener('click', () => {

            const $tableItems = [...$table.querySelectorAll('tr[tr-id]')];

            if(!$tableItems.some(tr => tr.getAttribute('tr-id') == id)){
                const $tr = d.createElement('tr');
                const $tdName = d.createElement('td');
                const $tdPrice = d.createElement('td');
                const $tdQuantity = d.createElement('td');
                const $tdspan = d.createElement('span');
                const $tdCross = d.createElement('td');
                const $icon = d.createElement('i');
                
                $tdName.textContent = name;
                $tdPrice.textContent = price;
                $tdspan.textContent = 1;

                $tr.setAttribute('tr-id', id);
                $tdQuantity.appendChild($tdspan);
                $icon.className = 'fa-sharp fa-solid fa-trash';
                
                $tdCross.appendChild($icon); 
                $tr.appendChild($tdName);
                $tr.appendChild($tdPrice);
                $tr.appendChild($tdQuantity);
                $tr.appendChild($tdCross);

                $icon.addEventListener('click', e => {
                    $total.textContent = parseFloat($total.textContent) - price;
                    if($total.textContent == '0'){
                        $cartEmpty.classList.remove('d-hide');
                    } else {
                        $cartEmpty.classList.add('d-hide');
                    }
                    if($tdspan.textContent == '1'){
                        $cartNumber.textContent = parseFloat($cartNumber.textContent) - 1;
                        $tr.remove();
                    } else {
                        $tdspan.textContent = parseFloat($tdspan.textContent) - 1;
                    }
                    
                })

                $table.appendChild($tr);
                $total.textContent = parseFloat($total.textContent) + price;
                $cartNumber.textContent = parseFloat($cartNumber.textContent) + 1;
                if($total.textContent == '0'){
                    $cartEmpty.classList.remove('d-hide');
                } else {
                    $cartEmpty.classList.add('d-hide');
                }
            } else {
                console.log('Ese manga ya esta en el carrito');
                const $itemRepetido = $table.querySelector(`tr[tr-id="${id}"] td span`);
                console.log($itemRepetido.textContent);
                $itemRepetido.textContent = parseFloat($itemRepetido.textContent) + 1;
                $total.textContent = parseFloat($total.textContent) + price;  
            }

            
        })
    })
}

function insertCards(cards){
    $contenedorCards.innerHTML = '';
    let fragment = '';
    for (const card of cards) {
        fragment += `
        <article class="card" data-id="${card.id}">
            <img class="card-img" src="${card.url}">
            <h2 class="card-title">${card.nombre}</h2>
            <p class="card-description">${card.descripcion}</p>
            <p class="card-price">$<strong>${card.precio}</strong></p>
            <button class="card-btn">Añadir al carrito</button>
        </article>   
        `;
    }
    $contenedorCards.innerHTML = fragment;

    const $insertedCards = d.querySelectorAll('.card');
    asignCardsEvents($insertedCards);
}

async function getData(){
    try {
        const response = await fetch('./productos.json');
        const data = await response.json();
        //console.log(data)
        insertCards(data);
    } catch (error) {
        console.log(error)
    }

}

d.addEventListener('DOMContentLoaded', getData)
