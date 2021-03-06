function isMobile() {
	let ua = window.navigator.userAgent;
	// let msie = ua.indexOf("MSIE ");
	let isMobile = {
		Android: () => ua.match(/Android/i),
		BlackBerry: () => ua.match(/BlackBerry/i),
		iOS: () => ua.match(/iPhone|iPad|iPod/i),
		Opera: () => ua.match(/Opera Mini/i),
		Windows: () => ua.match(/IEMobile/i),
		any: () => (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
	};
	return isMobile.any();
}

function isIE() {
	let ua = window.navigator.userAgent;
	return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
}
if (isIE()) {
	document.querySelector('html').classList.add('ie');
}
if (isMobile()) {
	document.querySelector('html').classList.add('_touch');
}

// Получить цифры из строки
//parseInt(itemContactpagePhone.replace(/[^\d]/g, ''))

function testWebP(callback) {
	let webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});

function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll("._ibg");
		for (let i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}
ibg();

window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});

let unlock = true;

//Menu
let iconMenu = document.querySelector(".icon-menu");
if (iconMenu != null) {
	let menuBody = document.querySelector(".menu__body");
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			let expanded = iconMenu.getAttribute('aria-expanded').toLowerCase() == 'true';
			// let expanded = iconMenu.getAttribute('aria-expanded').match(/^true$/i);
			iconMenu.setAttribute('aria-expanded', !expanded);
			focusRestrict(menuBody);
			modalShow(menuBody);
			bodyLock();
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		}
	});
};

function menuClose() {
	let iconMenu = document.querySelector(".icon-menu");
	let menuBody = document.querySelector(".menu__body");
	modalClose(menuBody);
	iconMenu.classList.remove("_active");
	menuBody.classList.remove("_active");
}
//=================
//BodyLock
function bodyLock(delay = 500) {
	let body = document.querySelector("body");

	if (body.classList.contains('_lock')) {
		bodyLockRemove(delay);
	} else {
		bodyLockAdd(delay);
	}
}
function bodyLockRemove(delay = 500) {
	let body = document.querySelector("body");
	if (unlock) {
		let lockPadding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
			// document.querySelector('.wrapper').setAttribute('aria-hidden', false);
		}, delay);
	}
}
function bodyLockAdd(delay = 500) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
			// document.querySelector('.wrapper').setAttribute('aria-hidden', true);
		}, delay);
	}
}
//=================
// LettersAnimation
let title = document.querySelectorAll('._letter-animation');
if (title.length) {
	for (let index = 0; index < title.length; index++) {
		let el = title[index];
		let txt = el.innerHTML;
		let txtWords = txt.replace('  ', ' ').split(' ');
		let newTitle = '';
		for (let index = 0; index < txtWords.length; index++) {
			let txtWord = txtWords[index];
			let len = txtWord.length;
			newTitle += '<p>';
			for (let index = 0; index < len; index++) {
				let it = txtWord.substr(index, 1);
				if (it == ' ') {
					it = '&nbsp;';
				}
				newTitle += '<span>' + it + '</span>';
			}
			el.innerHTML = newTitle;
			newTitle += '&nbsp;</p>';
		}
	}
}
//=================
//Tabs
let tabs = document.querySelectorAll("._tabs");
if (tabs.length) {
	for (let index = 0; index < tabs.length; index++) {
		let tab = tabs[index];
		let tabsItems = tab.querySelectorAll("._tabs-item");
		let tabsBlocks = tab.querySelectorAll("._tabs-block");
		if (tabsItems.length && tabsBlocks.length) {
			for (let index = 0; index < tabsItems.length; index++) {
				let tabsItem = tabsItems[index];
				tabsItem.addEventListener("click", function (e) {
					for (let index = 0; index < tabsItems.length; index++) {
						let tabsItem = tabsItems[index];
						tabsItem.classList.remove('_active');
						tabsBlocks[index].classList.remove('_active');
					}
					tabsItem.classList.add('_active');
					tabsBlocks[index].classList.add('_active');
					e.preventDefault();
				});
			}
		}
	}
}

//=================
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например:
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/

// SPOILERS
let spoilersArray = document.querySelectorAll('[data-spoilers]');

if (spoilersArray.length) {
	// getting spoilers w/o attrs
	const spoilersRegular = Array.from(spoilersArray).filter(item => !item.dataset.spoilers.split(',')[0]);
	const spoilersMedia = Array.from(spoilersArray).filter(item => item.dataset.spoilers.split(',')[0]);

	if (spoilersRegular.length) {
		initSpoilers(spoilersRegular);
	}

	if (spoilersMedia.length) {
		const breakpointsArray = [];
		spoilersMedia.forEach(item => {
			const paramsArray = item.dataset.spoilers.split(',');
			const breakpoint = {
				value: paramsArray[0],
				type: paramsArray[1] ? paramsArray[1].trim() : 'max',
				item
			};

			breakpointsArray.push(breakpoint);
		});

		// searching unique values, you can use new Set() instead of filter
		// so only one addEventListener per each unique matchMedia
		breakpointsArray
			.map(item => `${item.value},${item.type}`)
			.filter((item, index, array) =>
				array.indexOf(item) === index)
			.forEach(breakpoint => {
				const [mediaBreakpoint, mediaType] = breakpoint.split(',');
				const matchMedia = window.matchMedia(`(${mediaType}-width: ${mediaBreakpoint}px)`);
				const spoilersByBreakpoint = breakpointsArray.filter(item => item.value === mediaBreakpoint && item.type === mediaType);

				matchMedia.addEventListener('change', () => {
					initSpoilers(spoilersByBreakpoint, matchMedia);
				});
				initSpoilers(spoilersByBreakpoint, matchMedia);
			});
	}

	function initSpoilers(spoilersByBreakpoint, matchMedia = false) {
		spoilersByBreakpoint.forEach(spoilersGroup => {
			spoilersGroup = matchMedia ? spoilersGroup.item : spoilersGroup;
			if (matchMedia.matches || !matchMedia) {
				spoilersGroup.classList.add('_init');
				initSpoilerBody(spoilersGroup);
				spoilersGroup.addEventListener('click', setSpoilerAction);
			} else {
				spoilersGroup.classList.remove('_init');
				initSpoilerBody(spoilersGroup, false);
				spoilersGroup.removeEventListener('click', setSpoilerAction);
			}
		});
	}

	function initSpoilerBody(spoilersGroup, hideSpoilerBody = true) {
		const spoilerTitles = spoilersGroup.querySelectorAll('[data-spoiler]');
		if (spoilerTitles.length) {
			spoilerTitles.forEach(spoilerTitle => {
				// let listStyleDisplay = spoilerTitle.nextElementSibling.style.display;
				if (hideSpoilerBody) {
					spoilerTitle.removeAttribute('tabindex');
					if (!spoilerTitle.classList.contains('_active')) {
						// if (window.getComputedStyle(target).display === 'none') {
						// spoilerTitle.nextElementSibling.hidden = true;
						spoilerTitle.nextElementSibling.style.display = 'none';
					}
				} else {
					spoilerTitle.setAttribute('tabindex', '-1');
					// spoilerTitle.nextElementSibling.style.display = listStyleDisplay === 'none' ? 'block' : listStyleDisplay;
					spoilerTitle.nextElementSibling.style.display = '';
					// spoilerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	function setSpoilerAction(event) {
		const spoilerTitle = event.target.closest('[data-spoiler]');

		if (spoilerTitle) {
			const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
			const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler');

			if (!spoilersBlock.querySelectorAll('._slide').length) {
				if (oneSpoiler && !spoilerTitle.classList.contains('_active')) { //looks for active element in parent and closes it
					hideSpoilerBody(spoilersBlock);
				}
				spoilerTitle.classList.toggle('_active');
				_slideToggle(spoilerTitle.nextElementSibling, 500);
			}
			event.preventDefault();
		}
	}

	function hideSpoilerBody(spoilersBlock) {
		const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');

		if (spoilerActiveTitle) {
			spoilerActiveTitle.classList.remove('_active');
			_slideUp(spoilerActiveTitle.nextElementSibling, 500);
		}
	}
}
//=================
//Gallery
let gallery = document.querySelectorAll('._gallery');
if (gallery.length) {
	galleryInit();
}
function galleryInit() {
	for (let index = 0; index < gallery.length; index++) {
		const el = gallery[index];
		lightGallery(el, {
			counter: false,
			selector: 'a',
			download: false
		});
	}
}
//=================
//SearchInList
function search_in_list(input) {
	let ul = input.parentNode.querySelector('ul');
	let li = ul.querySelectorAll('li');
	let filter = input.value.toUpperCase();

	for (i = 0; i < li.length; i++) {
		let el = li[i];
		let item = el;
		txtValue = item.textContent || item.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			el.style.display = "";
		} else {
			el.style.display = "none";
		}
	}
}
//=================
//DigiFormat
function digi(str) {
	return str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}
//=================
//DiGiAnimate
function digiAnimate(digiAnimate) {
	if (digiAnimate.length) {
		for (let index = 0; index < digiAnimate.length; index++) {
			const el = digiAnimate[index];
			const el_to = parseInt(el.innerHTML.replace(' ', ''));
			if (!el.classList.contains('_done')) {
				digiAnimateValue(el, 0, el_to, 1500);
			}
		}
	}
}
function digiAnimateValue(el, start, end, duration) {
	let obj = el;
	let range = end - start;
	// no timer shorter than 50ms (not really visible any way)
	let minTimer = 50;
	// calc step time to show all interediate values
	let stepTime = Math.abs(Math.floor(duration / range));

	// never go below minTimer
	stepTime = Math.max(stepTime, minTimer);

	// get current time and calculate desired end time
	let startTime = new Date().getTime();
	let endTime = startTime + duration;
	let timer;

	function run() {
		let now = new Date().getTime();
		let remaining = Math.max((endTime - now) / duration, 0);
		let value = Math.round(end - (remaining * range));
		obj.innerHTML = digi(value);
		if (value == end) {
			clearInterval(timer);
		}
	}

	timer = setInterval(run, stepTime);
	run();

	el.classList.add('_done');
}
//=================
//Popups also can be done with :target
let popupLinks = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
// let lastFocus = [];
let lastFocus;


if (popupLinks.length) {
	popupLinks.forEach(el => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			if (unlock) {
				let item = el.getAttribute('href').replace('#', '');
				let video = el.getAttribute('data-video');
				popupOpen(item, video);
			}
		});
	});
}

if (popups.length) {
	popups.forEach(popup => {
		popup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__body') || e.target.closest('.popup__close')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	});
}
function modalShow(modal, transition = true) {
	// lastFocus.push(document.activeElement);
	lastFocus = document.activeElement;
	// modal.setAttribute('tabindex', '-1');
	// modal.tabIndex = '-1';
	transition ? modal.addEventListener('transitionend', modalTransitionListener, { once: true, caption: true }) : modal.focus();
	// { once: true });

	const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
	const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
	function modalTransitionListener(e) {
		// if (e.target == modal && (e.propertyName == 'transform' || e.propertyName == 'visibility')) {
		if (e.target == modal && lastFocus !== firstFocusableElement) {
			// modal.focus();
			// modal.querySelector('[tabindex="0"]').focus();
			firstFocusableElement.focus();
		}
	}

}
function modalClose(modal) {
	modal.addEventListener('transitionend', function (e) {
		// if (e.target == modal && (e.propertyName == 'transform' || e.propertyName == 'left')) {
		if (e.target == modal) {
			lastFocus.focus();
		}
		// lastFocus.pop().focus();
	}, { once: true, caption: true });
}

function focusRestrict(modal) {
	// to prevent scroll to the footer by shift+tab at the modal, can also prevent this by putting modal at afterbegin(prepend) of body or forEach focusable item in body set tabindex=-1 and then revert it when close modal

	const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
	const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];

	modal.addEventListener('focusout', modalFocusHandler);

	// modal.addEventListener('focusout', modalFocusHandler, true);

	function modalFocusHandler(e) {
		e.preventDefault();
		// if (modalOpen && !modal.contains(e.target)) {
		// if (document.querySelector('.popup._active') && !modal.contains(e.target)) {
		if (!modal.contains(e.relatedTarget) && (document.querySelector('.popup._active') || modal.classList.contains('_active'))) {
			e.stopPropagation();
			// modal.querySelector('[tabindex="0"]').focus();
			firstFocusableElement.focus();
			// modal.focus();
		}
	}
}

function popupOpen(item, video = '') {
	focusRestrict(document.querySelector(`.popup_${item} .popup__body`));

	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length) {
		popupClose('', false);
	}

	let currentPopup = document.querySelector('.popup_' + item);

	if (currentPopup && unlock) {
		if (video != '' && video != null) {
			let popupVideo = document.querySelector('.popup_video');
			popupVideo.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			bodyLockAdd();
		}
		currentPopup.classList.add('_active');
		modalShow(document.querySelector(`.popup_${item} .popup__body`));
		history.pushState('', '', '#' + item);
	}
}

function popupClose(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) { //closes all active popups
			let activePopups = document.querySelectorAll('.popup._active');
			activePopups.forEach(popup => {
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
				modalClose(popup.querySelector('.popup__body'));
			});
		} else { //closes a single one
			let video = item.querySelector('.popup__video');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
			modalClose(item.querySelector('.popup__body'));
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			bodyLockRemove();
		}
		history.pushState('', '', window.location.href.split('#')[0]);
	}
}

// let popupCloseIcon = document.querySelectorAll('.popup__close,._popup-close');
// if (popupCloseIcon.length) {
// 	popupCloseIcon.forEach(el => {
// 		el.addEventListener('click', function (e) {
// 			e.preventDefault();
// 			popupClose(el.closest('.popup'));
// 		});
// 	});
// }

document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape' || e.code === 27) {
		if (document.querySelector('.popup._active')) {
			popupClose();
		}
		else if (document.querySelector('.menu__body._active')) {
			menuClose();
		}
	}
});

//=================
//ActionsOnHash
if (location.hash) {
	const hash = location.hash.replace('#', '');
	if (document.querySelector('.popup_' + hash)) {
		popupOpen(hash);
	} else if (document.querySelector('div.' + hash)) {
		_goto(document.querySelector('.' + hash), 500, '');
	}
}
//=================
//=================
//SlideToggle
function _slideUp(target, duration = 500) {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		// target.hidden = true;
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
};

function _slideDown(target, duration = 500) {
	target.style.removeProperty('display');
	// if (target.hidden) {
	// 	target.hidden = false;
	// }
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';
	target.style.display = display;

	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	// add border-width 0?
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
};

function _slideToggle(target, duration = 500) {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		// if (target.hidden) {
		if (window.getComputedStyle(target).display === 'none') {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
};
//========================================
//Wrap
function _wrap(el, wrapper) {
	el.parentNode.insertBefore(wrapper, el);
	wrapper.appendChild(el);
}
//========================================
//RemoveClasses
function _removeClasses(el, class_name) {
	for (let i = 0; i < el.length; i++) {
		el[i].classList.remove(class_name);
	}
}
//========================================
//IsHidden
function _isHidden(el) {
	return (el.offsetParent === null);
}
// ShowMore Beta ========================
let moreBlocks = document.querySelectorAll('._more-block');
if (moreBlocks.length > 0) {
	let wrapper = document.querySelector('.wrapper');
	for (let index = 0; index < moreBlocks.length; index++) {
		const moreBlock = moreBlocks[index];
		let items = moreBlock.querySelectorAll('._more-item');
		if (items.length > 0) {
			let itemsMore = moreBlock.querySelector('._more-link');
			let itemsContent = moreBlock.querySelector('._more-content');
			let itemsView = itemsContent.getAttribute('data-view');
			if (getComputedStyle(itemsContent).getPropertyValue("transition-duration") === '0s') {
				itemsContent.style.cssText = "transition-duration: 1ms";
			}
			itemsMore.addEventListener("click", function (e) {
				if (itemsMore.classList.contains('_active')) {
					setSize();
				} else {
					setSize('start');
				}
				itemsMore.classList.toggle('_active');
				e.preventDefault();
			});

			let isScrollStart;
			function setSize(type) {
				let resultHeight;
				let itemsContentHeight = 0;
				let itemsContentStartHeight = 0;

				for (let index = 0; index < items.length; index++) {
					if (index < itemsView) {
						itemsContentHeight += items[index].offsetHeight;
					}
					itemsContentStartHeight += items[index].offsetHeight;
				}
				resultHeight = (type === 'start') ? itemsContentStartHeight : itemsContentHeight;
				isScrollStart = window.innerWidth - wrapper.offsetWidth;
				itemsContent.style.height = `${resultHeight}px`;
			}

			itemsContent.addEventListener("transitionend", updateSize, false);

			function updateSize() {
				let isScrollEnd = window.innerWidth - wrapper.offsetWidth;
				if (isScrollStart === 0 && isScrollEnd > 0 || isScrollStart > 0 && isScrollEnd === 0) {
					if (itemsMore.classList.contains('_active')) {
						setSize('start');
					} else {
						setSize();
					}
				}
			}
			window.addEventListener("resize", function (e) {
				if (!itemsMore.classList.contains('_active')) {
					setSize();
				} else {
					setSize('start');
				}
			});
			setSize();
		}
	}
}
//==RATING======================================
const ratings = document.querySelectorAll('.rating');
if (ratings.length > 0) {
	initRatings();
}
// Основная функция
function initRatings() {
	let ratingActive, ratingValue;
	// "Бегаем" по всем рейтингам на странице
	for (let index = 0; index < ratings.length; index++) {
		const rating = ratings[index];
		initRating(rating);
	}

	// Инициализируем конкретный рейтинг
	function initRating(rating) {
		initRatingVars(rating);

		setRatingActiveWidth();

		if (rating.classList.contains('rating_set')) {
			setRating(rating);
		}
	}

	// Инициализайция переменных
	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.rating__active');
		ratingValue = rating.querySelector('.rating__value');
	}
	// Изменяем ширину активных звезд
	function setRatingActiveWidth(index = ratingValue.innerHTML) {
		const ratingActiveWidth = index / 0.05;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}
	// Возможность указать оценку
	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.rating__item');
		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];
			ratingItem.addEventListener("mouseenter", function (e) {
				// Обновление переменных
				initRatingVars(rating);
				// Обновление активных звезд
				setRatingActiveWidth(ratingItem.value);
			});
			ratingItem.addEventListener("mouseleave", function (e) {
				// Обновление активных звезд
				setRatingActiveWidth();
			});
			ratingItem.addEventListener("click", function (e) {
				// Обновление переменных
				initRatingVars(rating);

				if (rating.dataset.ajax) {
					// "Отправить" на сервер
					setRatingValue(ratingItem.value, rating);
				} else {
					// Отобразить указанную оцнку
					ratingValue.innerHTML = index + 1;
					setRatingActiveWidth();
				}
			});
		}
	}
	async function setRatingValue(value, rating) {
		if (!rating.classList.contains('rating_sending')) {
			rating.classList.add('rating_sending');

			// Отправика данных (value) на сервер
			let response = await fetch('rating.json', {
				method: 'GET',

				//body: JSON.stringify({
				//	userRating: value
				//}),
				//headers: {
				//	'content-type': 'application/json'
				//}

			});
			if (response.ok) {
				const result = await response.json();

				// Получаем новый рейтинг
				const newRating = result.newRating;

				// Вывод нового среднего результата
				ratingValue.innerHTML = newRating;

				// Обновление активных звезд
				setRatingActiveWidth();

				rating.classList.remove('rating_sending');
			} else {
				alert("Ошибка");

				rating.classList.remove('rating_sending');
			}
		}
	}
}
//========================================
//Animate
function animate({ timing, draw, duration }) {
	let start = performance.now();
	requestAnimationFrame(function animate(time) {
		// timeFraction изменяется от 0 до 1
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// вычисление текущего состояния анимации
		let progress = timing(timeFraction);

		draw(progress); // отрисовать её

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}

	});
}
function makeEaseOut(timing) {
	return function (timeFraction) {
		return 1 - timing(1 - timeFraction);
	};
}
function makeEaseInOut(timing) {
	return function (timeFraction) {
		if (timeFraction < .5)
			return timing(2 * timeFraction) / 2;
		else
			return (2 - timing(2 * (1 - timeFraction))) / 2;
	};
}
function quad(timeFraction) {
	return Math.pow(timeFraction, 2);
}
function circ(timeFraction) {
	return 1 - Math.sin(Math.acos(timeFraction));
}
/*
animate({
	duration: 1000,
	timing: makeEaseOut(quad),
	draw(progress) {
		window.scroll(0, start_position + 400 * progress);
	}
});*/

//Полифилы
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			let node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
