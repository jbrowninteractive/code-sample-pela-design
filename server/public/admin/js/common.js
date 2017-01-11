function TextComponent(name, hints, value)
{
    var node = document.createElement("div");
    node.className = "text-component";

    var removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = "x";

    var input = document.createElement("input");
    input.name = name;
    input.value = typeof value === "string" ? value : "";

    $(input).autocomplete(
    {
        source: hints
    });

    removeBtn.onclick = function()
    {
        node.parentNode.removeChild(node);
    };

    node.appendChild(input);
    node.appendChild(removeBtn);

    return node;
}

function ImageComponent(src, origId)
{
    var node = document.createElement("div");
    node.className = "image-component";

    var img = document.createElement("img");
    if (src)
    {
        img.src = src;
    }

    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "origIds";
    hidden.value = origId || "";

    var input = document.createElement("input");
    input.type = "file";
    input.name = "images";

    var select = document.createElement("select");
    select.className = "pos-select";
    select.addEventListener("change", sortImageComponents);

    var removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = "x";

    removeBtn.onclick = function()
    {
        node.parentNode.removeChild(node);
        select.removeEventListener("change", sortImageComponents);
        sortImageComponents();
    };

    input.onchange = function()
    {
        if (!input.files[0])
        {
            return;
        }

        var reader = new FileReader();

        reader.onload = function(e)
        {
            img.src = e.target.result;
            hidden.value = "";
        }

        reader.readAsDataURL(input.files[0]);
    };

    node.appendChild(img);
    node.appendChild(input);
    node.appendChild(select);
    node.appendChild(removeBtn);
    node.appendChild(hidden);
    sortImageComponents();
    return node;
}

function sortImageComponents(event)
{
    setTimeout(function()
    {
        var target = event && event.target;
        var container = document.getElementsByClassName("images-node")[0];
        var selects = Array.prototype.slice.call(container.getElementsByClassName("pos-select"));

        container.innerHTML = "";

        if (target)
        {
            var oldIndex = selects.indexOf(target);
            var newIndex = Number(target.value) - 1;
            selects.move(oldIndex, newIndex);
        }

        for (var i = 0; i < selects.length; i++)
        {
            var select = selects[i];
            select.innerHTML = "";

            for (var j = 0; j < selects.length; j++)
            {
                var option = document.createElement("option");
                option.value = option.innerHTML = j + 1;
                select.appendChild(option);

                if (i === j)
                {
                    option.setAttribute("selected", "");
                }
            }

            container.appendChild(select.parentNode);
        }
    });


}

Array.prototype.move = function(old_index, new_index)
{
    if (new_index >= this.length)
    {
        var k = new_index - this.length;
        while ((k--) + 1)
        {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
