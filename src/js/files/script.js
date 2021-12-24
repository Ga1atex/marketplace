window.onload = function () {
  let ratings = document.querySelectorAll('.star-rating');
  if (ratings.length) {
    ratings.forEach((item) => {
      let ratingStar = item.querySelector('.star-rating__star');
      let ratingGroup = item.querySelector('.star-rating__group');
      let bestValue = item.querySelector('.star-rating__best-value').innerHTML || '5.0';
      let ratingValue = item.querySelector('.star-rating__value').innerHTML;

      ratingGroup.style.width = `calc(${getComputedStyle(ratingStar).backgroundSize.split(' ')[0]} * ${bestValue})`;

      // ratingStar.style.width = `calc(${getComputedStyle(ratingStar).backgroundSize.split(' ')[0]} * ${item.querySelector('.rating__value').innerHTML})`;
      ratingStar.style.width = `${ratingValue / (bestValue / 100)}%`;
    });
  }


  if (document.querySelector('.product-page__btns')) {
    document.querySelector('.product-page__btns').addEventListener('click', function (event) {
      if (event.target.classList.contains('active') || event.target.classList.contains('product-page__btns')) return;

      if (event.target.classList.contains('icon-th-list')) {
        document.querySelector('.product-page__items').classList.add('product-items_list');
      } else if (event.target.classList.contains('icon-th-large')) {
        document.querySelector('.product-page__items').classList.remove('product-items_list');
      }
      // document.querySelector('.product-page__items').classList.toggle('product-items_list');
      event.target.parentElement.querySelector('.active').classList.remove('active');
      event.target.classList.add('active');
    });
  }

  if (document.querySelector('.products__items')) {
    const mixer = mixitup('.products__items');
  }
  if (document.querySelector('.product-page__items')) {
    const mixer = mixitup('.product-page__items', {});
  }

  let progressBars = document.querySelectorAll('.progress-bar');
  if (progressBars.length) {
    progressBars.forEach(item => {
      item.querySelector('.progress-bar__lane span').style.maxWidth = item.querySelector('.progress-bar__number').innerHTML;
    });
  }

  let fileInputs = document.querySelectorAll('input[type="file"].input-file');

  if (fileInputs.length) {
    fileInputs.forEach(input => {
      input.outerHTML = `<label class="input-file input form__input">
                    <span class="input-file__btn">${input.dataset.browse ? input.dataset.browse : 'Choose File'}</span>
                    <input class="input-file__input visually-hidden"${input.id ? `id="${input.id}"` : ''} type="file"${input.required ? ' required' : ''}${input.multiple ? ' multiple' : ''}>
                    <span class="input-file__filename">${input.dataset.placeholder ? input.dataset.placeholder : 'No File Choosen'}</span>
                  </label>`;
    });
  }

  let customFileInputs = document.querySelectorAll('.input-file');

  if (customFileInputs.length) {
    customFileInputs.forEach(item => {
      let fileName = item.querySelector('.input-file__filename');
      let input = item.querySelector('.input-file__input');
      input.addEventListener('change', fileNameChange);

      function fileNameChange(e) {
        fileName.textContent = '';
        if (e.target.files.length) {
          Array.from(e.target.files).forEach(file => {
            fileName.textContent += file.name + ' ';
          });
        }
      }
    });
  }


  document.addEventListener('click', documentСlicks);

  function documentСlicks(e) {
    let activeHeaderDropdown = document.querySelector('.header-dropdown._active');
    if (isMobile()) {
      if (activeHeaderDropdown && !e.target.closest('.header-dropdown._active')) {
        activeHeaderDropdown.classList.remove('_active');
      }
      if (e.target.closest('.header-dropdown') && !e.target.closest('.header-dropdown__menu')) {
        e.target.closest('.header-dropdown').classList.toggle('_active');
      }
    } else {
      if (activeHeaderDropdown) {
        activeHeaderDropdown.classList.remove('_active');
      }
    }



  }
};