(document).ready(function () {
    // Set first item as active by default
    $(".item-btn").first().addClass("active");
    updateSelectedItem($(".item-btn").first());

    // Item selection
    $(".item-btn").click(function () {
        $(".item-btn").removeClass("active");
        $(this).addClass("active");
        updateSelectedItem($(this));
    });

    // Category switching
    $(".category-btn").click(function () {
        $(".category-btn").removeClass("active");
        $(this).addClass("active");

        var category = $(this).data("category");

        if (category === "Food") {
            $("#meals-container, #ingredients-container").show();
            $("#equipment-container").hide();
        } else if (category === "Things") {
            $("#meals-container, #ingredients-container").hide();
            $("#equipment-container").show();
        }
    });

    // Function to update selected item details
    function updateSelectedItem(button) {
        var name = button.data("name");
        var img = button.data("img");

        $("#selectedItemName").text(name);
        $("#selectedItemImage").attr("src", img);
    }
});