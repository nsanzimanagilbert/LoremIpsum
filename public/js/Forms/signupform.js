import { createUser } from '../user';
export const signupFormFunctions = () => {
  const signUpForm = document.getElementById('signupForm');
  if (signUpForm) {
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

    //Form Stages
    const stage1 = document.querySelector('.stage-1');
    const stage2 = document.querySelector('.stage-2');
    const stage3 = document.querySelector('.stage-3');
    const stage4 = document.querySelector('.stage-4');
    const stage5 = document.querySelector('.stage-5');

    //Form Styles

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
        stage2.classList.add('active-stage');
      });
    }

    if (formPartBtn2) {
      formPartBtn2.addEventListener('click', () => {
        if (serviceStatus == 'student') {
          formPart1.style.transform = 'translateX(-200%)';
          formPart2.style.transform = 'translateX(-100%)';
          formPart3.style.transform = 'translateX(0%)';
          stage3.classList.add('active-stage');
        } else {
          formPart4.style.transform = 'translateX(0%)';
          formPart1.style.transform = 'translateX(-300%)';
          formPart2.style.transform = 'translateX(-200%)';
          stage3.classList.add('active-stage');
          stage4.classList.add('active-stage');
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
        stage4.classList.add('active-stage');
      });
    }

    if (formPartBtn4) {
      formPartBtn4.addEventListener('click', () => {
        formPart5.style.transform = 'translateX(0%)';
        formPart1.style.transform = 'translateX(-400%)';
        formPart2.style.transform = 'translateX(-300%)';
        formPart3.style.transform = 'translateX(-200%)';
        formPart4.style.transform = 'translateX(-100%)';
        stage5.classList.add('active-stage');
      });
    }

    signUpForm.addEventListener('submit', async e => {
      e.preventDefault();
      //Form Input values
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const gender = document.getElementById('gender').value;
      const dob = document.getElementById('dateOfBirth').value;
      let student;
      if (serviceStatus == 'student') {
        student = true;
      } else {
        student = false;
      }

      const institution = student
        ? `${document.getElementById('institution').value}`
        : '';
      const course = student
        ? `${document.getElementById('course').value}`
        : '';
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      const duty = 'client';
      const role = 'user';
      const profile = '';
      console.log(firstName, lastName, gender, dob);
      await createUser(
        firstName,
        lastName,
        gender,
        dob,
        email,
        phone,
        duty,
        role,
        profile,
        student,
        institution,
        course,
        password,
        passwordConfirm
      );
    });
  }
};

// Sign up form revealers End
///////////////////////////////
