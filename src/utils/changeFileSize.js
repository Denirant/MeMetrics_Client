export default function updateItemWidth() {
    const fileplate = document.querySelector('.fileplate');
    const fileplateItems = document.querySelectorAll('.file-plate');


    const parentWidth = fileplate.getBoundingClientRect().width;
    const gap = 12;
    const itemsPerRow = Math.floor((parentWidth) / (175 + gap)); // Вычисляем количество элементов в строке
    const itemWidth = Math.floor((parentWidth - (itemsPerRow - 1) * gap) / itemsPerRow);

    fileplateItems.forEach((item, index) => {
        item.style.flex = `0 0 ${itemWidth - 1}px`;
    });


    // fileplate.style.gap = `${(parentWidth - itemsPerRow * itemWidth) / (itemsPerRow - 1)}px`;

}
