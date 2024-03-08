const itemList = [];

const addItem = () => {
    const itemInput = document.getElementById("itemInput");
    const quantityInput = document.getElementById("quantityInput");
    const quantityType = document.getElementById("quantityType");

    const listItem = {
        id: Date.now(),
        ingredient: itemInput.value,
        quantity: quantityInput.value,
        type: quantityType.value,
    };

    if (listItem.ingredient !== "" && listItem.quantity >= 0 && listItem.type !== "") {
        itemList.push(listItem);
        renderList();
        itemInput.value = "";
        quantityInput.value = 0;
        quantityType.value = "";
    }
};

const deleteItem = (id) => {
    const index = itemList.findIndex(item => item.id === id);
    if (index !== -1) {
        itemList.splice(index, 1);
        renderList();
    }
}

// const editItem = (id) => {
//     const newText = prompt("New Ingredient");
//     const index = itemList.findIndex(item => item.id === id);
//     if (index !== -1 && newText !== null) {
//         itemList[index].ingredient = newText;
//         renderList();
//     }
// }

// const renderList = () => {
//     const itemListContainer = document.getElementById("itemList");
//     itemListContainer.innerHTML = "";
    
//     itemList.forEach(item => {
//         const li = document.createElement("li");
//         li.textContent = `${item.quantity} ${item.type} - ${item.ingredient}`;

//         const buttonContainer = document.createElement("div");
//         buttonContainer.classList.add("button-container");

//         const deleteBtn = document.createElement("button");
//         deleteBtn.textContent = "Delete";
//         deleteBtn.classList.add("btn", "btn-danger", "mr-2")
//         deleteBtn.addEventListener("click", () => deleteItem(item.id));
//         buttonContainer.appendChild(deleteBtn);

//         const editBtn = document.createElement("button");
//         editBtn.textContent = "Edit";
//         editBtn.classList.add("btn", "btn-warning")
//         editBtn.addEventListener("click", () => editItem(item.id));
//         buttonContainer.appendChild(editBtn);

//         li.appendChild(buttonContainer);
//         itemListContainer.appendChild(li);
        
//         setTimeout(() => {
//             li.classList.add("fade-in");
//         }, 10);
//     });
// };


const renderList = () => {
    const itemListContainer = document.getElementById("itemList");
    itemListContainer.innerHTML = "";

    itemList.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        const ingredientInput = document.createElement("input");
        ingredientInput.type = "text";
        ingredientInput.value = item.ingredient;
        ingredientInput.addEventListener("change", () => {
            item.ingredient = ingredientInput.value;
        });

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = item.quantity;
        quantityInput.addEventListener("change", () => {
            item.quantity = quantityInput.value;
        });

        const typeInput = document.createElement("input");
        typeInput.type = "text";
        typeInput.value = item.type;
        typeInput.addEventListener("change", () => {
            item.type = typeInput.value;
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
        deleteBtn.addEventListener("click", () => deleteItem(item.id));

        li.appendChild(ingredientInput);
        li.appendChild(quantityInput);
        li.appendChild(typeInput);
        li.appendChild(deleteBtn);

        itemListContainer.appendChild(li);
    });
};

document.getElementById("addItemBtn").addEventListener("click", addItem);