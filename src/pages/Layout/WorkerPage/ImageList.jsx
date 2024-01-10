import React from "react";

const ImageList = ({ imageLinks }) => {
  // Ограничиваем количество отображаемых картинок до 2
  const displayedImages = imageLinks.slice(0, 2);
  // Определяем количество оставшихся картинок
  const remainingImagesCount = imageLinks.length - displayedImages.length;

  return (
    <div className="image_list--container">
      <ul>
        {displayedImages.map((link, index) => (
          <li key={index}>
            <img src={link} alt={`Image_activity_icon_${index + 1}`} />
          </li>
        ))}
        {/* Если есть оставшиеся изображения, выводим их количество */}
        {remainingImagesCount > 0 && (
          <li>
            <p>{`+${remainingImagesCount} more`}</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ImageList;
