window.onload = function () {
  let ratings = document.querySelectorAll('.star-rating');
  ratings.forEach((item) => {
    let ratingStar = item.querySelector('.star-rating__star');
    let ratingGroup = item.querySelector('.star-rating__group');
    let bestValue = item.querySelector('.star-rating__best-value').innerHTML || '5.0';
    let ratingValue = item.querySelector('.star-rating__value').innerHTML;

    ratingGroup.style.width = `calc(${getComputedStyle(ratingStar).backgroundSize.split(' ')[0]} * ${bestValue})`;

    // ratingStar.style.width = `calc(${getComputedStyle(ratingStar).backgroundSize.split(' ')[0]} * ${item.querySelector('.rating__value').innerHTML})`;
    ratingStar.style.width = `${ratingValue / (bestValue / 100)}%`;
  });

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


  // $('.product-details__tabs .tab, .settings__tabs .tab').on('click', function (event) {
  //   var id = $(this).attr('data-id');
  //   $('.product-details__tabs, .settings__tabs').find('.tab-item').removeClass('active-tab').hide();
  //   $('.product-details__tabs .tabs, .settings__tabs .tabs').find('.tab').removeClass('active');
  //   $(this).addClass('active');
  //   $('#' + id).addClass('active-tab').fadeIn();
  //   return false;
  // });


  document.querySelector('.header__btn-menu').addEventListener('click', function (event) {
    document.querySelector('.header__box').classList.toggle('active');
  });

  if (document.querySelector('.products__items')) {
    const mixer = mixitup('.products__items');
  }
  if (document.querySelector('.product-page__items')) {
    const mixer = mixitup('.product-page__items', {});
  }
};