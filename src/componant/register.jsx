import React from 'react';
import './Css/Log-Reg.css'

function Register() {
  return (
    <div className="vh-100">
      <section className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form>
              {/* Email input */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                />
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
              </div>

              {/* Password input */}
              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                />
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
              </div>

              {/* Conform password input */}
              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example5"
                  className="form-control form-control-lg"
                  placeholder="Conform password"
                />
                <label className="form-label" htmlFor="form3Example5">
                  Conform Password
                </label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div
        className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary"
      >
        {/* Copyright */}
        <div className="text-white mb-3 mb-md-0">
          VASVOX CO., LTD © 2020.
        </div>

        {/* Right */}
        <div>
          <a href="#" className="text-white me-4">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="text-white me-4">
            <i className="fab fa-twitter" />
          </a>
          <a href="#" className="text-white me-4">
            <i className="fab fa-google" />
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;