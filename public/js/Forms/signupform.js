export const signupFormFunctions = () => {
  //Forms buttons
  const formPart1 = document.querySelector('.form-part--1');
  const formPart2 = document.querySelector('.form-part--2');
  const formPart3 = document.querySelector('.form-part--3');
  const formPart4 = document.querySelector('.form-part--4');
  const formPart5 = document.querySelector('.form-part--5');

  //Form Buttons
  const formPartBtn1 = document.querySelector('.btn-form-part--1');
  const formPartBtn2 = document.querySelector('.btn-form-part--2');
  const formPartBtn3 = document.querySelector('.btn-form-part--3');
  const formPartBtn4 = document.querySelector('.btn-form-part--4');

  //Form Styles

  //Form Input values
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const gender = document.getElementById('gender');
  const dateOfBirth = document.getElementById('dateOfBirth');

  //   Service Options
  let serviceStatus;
  const serviceStatuses = document.querySelectorAll(
    'input[name="serviceStatus"]'
  );
  const findSelected = () => {
    const selected = document.querySelector(
      'input[name="serviceStatus"]:checked'
    );
    serviceStatus = selected.value;
  };

  serviceStatuses.forEach(service =>
    service.addEventListener('change', findSelected)
  );

  if (formPartBtn1) {
    formPartBtn1.addEventListener('click', () => {
      formPart1.style.transform = 'translateX(-100%)';
      formPart2.style.transform = 'translateX(0%)';
    });
  }

  if (formPartBtn2) {
    formPartBtn2.addEventListener('click', () => {
      if (serviceStatus == 'student') {
        formPart1.style.transform = 'translateX(-200%)';
        formPart2.style.transform = 'translateX(-100%)';
        formPart3.style.transform = 'translateX(0%)';
      } else {
        formPart4.style.transform = 'translateX(0%)';
        formPart1.style.transform = 'translateX(-300%)';
        formPart2.style.transform = 'translateX(-200%)';
      }
    });
  }

  if (formPartBtn3) {
    formPartBtn3.addEventListener('click', () => {
      console.log('Clicked..');
      formPart4.style.transform = 'translateX(0%)';
      formPart3.style.transform = 'translateX(-100%)';
      formPart2.style.transform = 'translateX(-200%)';
      formPart1.style.transform = 'translateX(-300%)';
      formPart5.style.transform = 'translateX(100%)';
    });
  }

  if (formPartBtn4) {
    formPartBtn4.addEventListener('click', () => {
      formPart5.style.transform = 'translateX(0%)';
      formPart1.style.transform = 'translateX(-400%)';
      formPart2.style.transform = 'translateX(-300%)';
      formPart3.style.transform = 'translateX(-200%)';
      formPart4.style.transform = 'translateX(-100%)';
    });
  }
};

// Sign up form revealers End
///////////////////////////////
