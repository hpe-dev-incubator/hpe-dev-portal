---
title: Test CSS/HTML page
version: "1"
description: Test Didier
image: /img/platforms/EzmeralContainerPatform.svg
width: large
priority: 4
active: false
---
<style>
      .page-loading {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-transition: all .4s .2s ease-in-out;
        transition: all .4s .2s ease-in-out;
        background-color: #fff;
        opacity: 0;
        visibility: hidden;
        z-index: 9999;
      }
      .dark-mode .page-loading {
        background-color: #0b0f19;
      }
      .page-loading.active {
        opacity: 1;
        visibility: visible;
      }
      .page-loading-inner {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        text-align: center;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        -webkit-transition: opacity .2s ease-in-out;
        transition: opacity .2s ease-in-out;
        opacity: 0;
      }
      .page-loading.active > .page-loading-inner {
        opacity: 1;
      }
      .page-loading-inner > span {
        display: block;
        font-size: 1rem;
        font-weight: normal;
        color: #9397ad;
      }
      .dark-mode .page-loading-inner > span {
        color: #fff;
        opacity: .6;
      }
      .page-spinner {
        display: inline-block;
        width: 2.75rem;
        height: 2.75rem;
        margin-bottom: .75rem;
        vertical-align: text-bottom;
        border: .15em solid #b4b7c9;
        border-right-color: transparent;
        border-radius: 50%;
        -webkit-animation: spinner .75s linear infinite;
        animation: spinner .75s linear infinite;
      }
      .dark-mode .page-spinner {
        border-color: rgba(255,255,255,.4);
        border-right-color: transparent;
      }
      @-webkit-keyframes spinner {
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes spinner {
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }

      #background-video {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    position: fixed;
    left: 0;
    top: 0;
    opacity:0.8;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('assets/img/background3.jpg');
  background-size: cover;
  opacity: 0.8;
  z-index: -2; /* Place the video behind the section content */
}

.background-filter {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7414);
  background-size: cover;
  opacity: 0.7;
  z-index: -1; /* Place the video behind the section content */
}

.ezmeral-title { 
        background-image: linear-gradient(270deg, #00E8CF 0%, #904DFF 50%, #F740FF 100%);
        font-family: 'MetricHPE-Semibold';
        font-weight: 600;
        background-repeat: repeat; 
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent; 
        -webkit-font-smoothing: antialiased; 
    } 
</style>

<!-- Page wrapper for sticky footer -->
<!-- Wraps everything except footer to push footer to the bottom of the page if there is little content -->
<main class="page-wrapper">
  <header id="header" class="header">
  </header>

  <!-- Hero + BG parallax -->

  <section class="position-relative pt-5 overflow-hidden">
    <span id="background-video" style="background-image: url('assets/img/background3.jpg'); opacity: 0.2; z-index:-1;" alt="Background Image">
        <!-- <span class="position-absolute top-0 start-0 w-100 h-100" style="background: #f3f6ff;" style="z-index: 999;"> -->
    </span>
    <!-- <div class="background-filter"></div> -->
    <div class="container position-relative mt-2 pt-xl-4 pt-md-3 zindex-5">
      <div class="row">
        <div class="col-6">
      <div class="navbar-brand2">
        <!-- <img src="assets/img/hpe-logo-black.png" width="112" alt="Ezmeral"> -->
        <!-- <img src="assets/img/ezmeral_logo.svg" width="47" alt="Ezmeral"> -->
        <img style="margin-top: -3px;" src="assets/img/hpe-element.png" width="85" alt="Ezmeral">
        <span class="main-title-text px-2">HPE <span style="font-family: 'MetricHPE-Regular'; font-weight: 800;">Ezmeral Software</span></span>
      </div>
    </div>

    </div>
      <div class="row justify-content-md-start justify-content-center flex-md-nowrap pt-lg-5 pt-4">
        <div class="col-xl-5 col-md-6 col-sm-10 d-flex flex-column justify-content-between mt-5 mb-md-5 mb-md-4 mb-3 pb-xl-5 pb-lg-4">
          <div class="text-md-start text-center mt-4">
            <h1 class="display-4 mb-lg-4 mb-3" style="font-family: 'MetricHPE-Semibold'; font-weight:200;">Enterprise Data, Analytics and AI.<br> <span class="ezmeral-title">Unified.<span></h1>
            <p class="mb-4 mx-md-0 mx-auto pb-xl-3 pb-lg-2 fs-lg" style="max-width: 30.5rem;"><span style="font-weight: 800;">HPE Ezmeral Software</span> removes the complexity of connecting and managing your preferred tools and frameworks for building petabyte-scale data pipelines, analytics applications and AI.</p>
            <a style="text-decoration: none;" href="https://github.com/HPEEzmeral/ezua-tutorials"><button href="https://github.com/HPEEzmeral/ezua-tutorials" class="btn btn2-secondary btn-outline-primary">
              Explore Github
              <!-- <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png" alt="Arrow"> -->
              <i class="bx bxl-github"></i> <!-- needs a mt-1 on Firefox -->
            </button></a>
            <a style="text-decoration: none;" href="mailto:ezmeralsales@hpe.com?subject=HPE Ezmeral Software Inquiry&body=I'm reaching out to explore the potential of HPE Ezmeral Software for addressing our organization's evolving needs. [insert business name here] is interested in better understanding how Ezmeral can contribute to our overall data infrastructure and AI/ML objectives. To better assess its suitability, we'd appreciate the opportunity to schedule a discussion or demonstration to delve into key aspects such as product features, use cases, pricing, support, and integration."><button href="#demo" class="btn btn2 btn-outline-primary">
              Get in touch
              <!-- <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png" alt="Arrow"> -->
              <i class="bx bx-mail-send"></i> <!-- needs a mt-1 on Firefox -->
            </button></a>
          </div>
          <!-- <ul class="list-unstyled row row-cols-2 gy-sm-2 gy-1 gx-sm-4 gx-2 mt-lg-5 mt-4 mx-md-0 mx-auto pt-lg-0 pt-md-2 mb-md-5 mb-4 pb-xl-4 pb-lg-3 pb-md-2 pb-sm-0 pb-2 text-nowrap" style="max-width: 23.625rem;">
            <li class="col d-flex align-items-start">
              <i class="bx bx-check-circle me-2 fs-5 text-primary"></i>
              Public economy
            </li>
            <li class="col d-flex align-items-start">
              <i class="bx bx-check-circle me-2 fs-5 text-primary"></i>
              Corporate finance
            </li>
            <li class="col d-flex align-items-start">
              <i class="bx bx-check-circle me-2 fs-5 text-primary"></i>
              Financial planning
            </li>
            <li class="col d-flex align-items-start">
              <i class="bx bx-check-circle me-2 fs-5 text-primary"></i>
              Project finance
            </li>
          </ul> -->
        </div>
        <div class="col-md-12 offset-xl-1 d-flex mt-lg-4 mb-4">
          <div class="align-self-end ms-xl-0 ms-md-4 p-lg-4 p-sm-3 p-2 rounded-4 overflow-hidden" style="background: linear-gradient(153.32deg, rgba(255, 255, 255, .3) -65.62%, rgba(255, 255, 255, .1) 83.28%); box-shadow: 0 .25rem 1.5rem -.0625rem rgba(0, 0, 0, .2); backdrop-filter: blur(25px);">
            <img src="assets/img/unifiedanalytics/dashboard-hero.png" width="1122" alt="Layer" class="rounded-4" style="box-shadow: 0 0 7.5rem rgba(0, 0, 0, .1);" alt="Unified Analytics Dashboard">
          </div>
        </div>
      </div>
    </div>
    <span class="position-absolute bottom-0 start-0 w-100">
      <span class="d-dark-mode-none d-block w-100 h-100 py-xl-5 pt-lg-4 pt-md-0 pt-4 pb-5" style="background:rgb(253,253,253);"></span>
    </span>
  </section>

  <!-- DEMOS -->

  <section class="pb-lg-5 pb-md-4 pb-3" style="background:rgb(253,253,253);">
    <div class="container mb-2">
      <h2 class="h1 mb-lg-4 mb-3 text-center"> <br></h2>
    <h2 class="h1 mb-lg-4 mb-3 text-center"><span style="font-family: 'MetricHPE-Regular'; font-weight: 800;">Built for the biggest,</span> <br> leveraged by the best.</h2>
    <p class="mb-lg-5 mb-4 pb-lg-0 pb-md-2 mx-auto text-center" style="max-width: 60.75rem;">HPE Ezmeral Software applies a unified approach to analytics and AI, enabling organizations across a wide variety of industry to build large scale models twice as fast, generate insights from billions of records in just milliseconds, and accelerate the transformation of their businesses.</p>

    <!-- Swiper slider -->
    <div class="swiper mx-n2 swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden" data-swiper-options="{
      &quot;slidesPerView&quot;: 2,
      &quot;pagination&quot;: {
        &quot;el&quot;: &quot;.swiper-pagination&quot;,
        &quot;clickable&quot;: true
      },
      &quot;breakpoints&quot;: {
        &quot;500&quot;: {
          &quot;slidesPerView&quot;: 3,
          &quot;spaceBetween&quot;: 8
        },
        &quot;650&quot;: {
          &quot;slidesPerView&quot;: 4,
          &quot;spaceBetween&quot;: 8
        },
        &quot;900&quot;: {
          &quot;slidesPerView&quot;: 5,
          &quot;spaceBetween&quot;: 8
        },
        &quot;1100&quot;: {
          &quot;slidesPerView&quot;: 6,
          &quot;spaceBetween&quot;: 8
        }
      }
    }">
      <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);" id="swiper-wrapper-7bbc32caf10ff2ddc" aria-live="polite">

        <!-- Item -->
        <div class="swiper-slide py-3 swiper-slide-active" style="width: 187.667px; margin-right: 8px;" role="group" aria-label="1 / 6">
          <a href="https://alliantinsight.com" class="card card-body card-hover px-2 mx-2">
            <img src="assets/img/brands/alliant.png" class="d-block mx-auto my-2" width="154" alt="Brand">
          </a>
        </div>

        <!-- Item -->
        <div class="swiper-slide py-3 swiper-slide-next" style="width: 187.667px; margin-right: 8px;" role="group" aria-label="2 / 6">
          <a href="https://www.new-work.se/en" class="card card-body card-hover px-2 mx-2">
            <img src="assets/img/brands/new-work.png" class="d-block mx-auto my-2" width="354" alt="Brand">
          </a>
        </div>

        <!-- Item -->
        <div class="swiper-slide py-3" style="width: 187.667px; margin-right: 8px;" role="group" aria-label="3 / 6">
          <a href="https://www.bidtellect.com" class="card card-body card-hover px-2 mx-2">
            <img src="assets/img/brands/bidtellect.png" class="d-block mx-auto my-2" width="254" alt="Brand">
          </a>
        </div>

        <!-- Item -->
        <div class="swiper-slide py-3" style="width: 187.667px; margin-right: 8px;" role="group" aria-label="4 / 6">
          <a href="https://www.novartis.com" class="card card-body card-hover px-2 mx-2">
            <img src="assets/img/brands/novartis.png" class="d-block mx-auto my-2" width="354" alt="Brand">
          </a>
        </div>

        <!-- Item -->
        <div class="swiper-slide py-3" style="width: 187.667px; margin-right: 8px;" role="group" aria-label="5 / 6">
          <a href="https://www.carestream.com" class="card card-body card-hover px-2 mx-2">
            <img src="assets/img/brands/carestream.jpeg" class="d-block mx-auto my-2" width="354" alt="Brand">
          </a>
        </div>

        <!-- Item -->
        <div class="swiper-slide py-3" style="width: 187.667px; margin-right: 8px;" role="group" aria-label="6 / 6">
          <a href="https://www.nvidia.com/" class="card card-body card-hover px-2 mx-2">
            <img src="assets/img/brands/nvidia.png" class="d-block mx-auto my-2" width="354" alt="Brand">
          </a>
        </div>
      </div>

      <!-- Pagination (bullets) -->
      <div class="swiper-pagination position-relative pt-2 mt-4 swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal swiper-pagination-lock"><span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide 1" aria-current="true"></span></div>
    <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
    </div>
    <h2 class="h1 mb-lg-3 mb-2 text-center"> <br></h2>

  </section>

  

  <section id="demo" class="mb-5 py-lg-4" style="z-index:999;">
    <div class="container py-md-4 py-lg-5">
      <h2 class="h1 text-center text-md-start mb-lg-4" style="font-family: 'MetricHPE-Regular'; font-weight: 400;">Latest demos</h2>
      <div class="row align-items-center pb-5 mb-3">
        <div class="col-md-9 col-lg-8 col-xl-7 text-center text-md-start">
          <p class="fs-xl text-muted mb-md-0">Explore how HPE Ezmeral Software can accelerate your data, analytics and AI workloads.</p>
        </div>
        <div class="col-md-3 col-lg-4 col-xl-5 d-flex justify-content-center justify-content-md-end">
          <a style="text-decoration: none;" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/demos"><button href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/demos" class="btn btn2 btn-outline-primary">
            View all on Github
            <i class="bx bxl-github" style="margin-top: 2px; margin-left: 7px; font-size: 24px;"></i>
          </button></a>            </div>
      </div>

    <div class="row">
      <div class="col-lg-5 col-12 mb-lg-0 mb-4">

        <!-- Article -->
        <article class="card card-hover h-100 border-0 shadow-sm">
          <div class="position-relative">
            <a href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/demos/question-answering" class="position-absolute top-0 start-0 w-100 h-100 stretched-link" aria-label="Read more"></a>
            <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-5 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Read later" data-bs-original-title="Read later">
              <i class="bx bx-bookmark"></i>
            </a> -->
            <img src="assets/img/demos/ai_demo2.jpg" class="card-img-top" alt="Image">
          </div>
          <div class="card-body pb-4">
            <div class="d-flex justify-content-between mb-3">
              <div class="justify-content-between">
              <a href="" class="badge fs-sm text-nav bg-secondary text-decoration-none">AI &amp; Machine Learning</a>
              <a href="" class="badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
              </div>
              <span class="fs-sm py-1 text-muted">August 2023</span>
            </div>
            <h3 class="h4 mb-0">
              <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/demos/question-answering">EnterpriseGPT: A locally-hosted chatbot for enterprise data.</a>
            </h3>
            <h3 class="h5 mt-2">
            <span style="font-family: 'MetricHPE-Light';">Create an enterprise-grade chatbot using HPE Ezmeral Unified Analytics Software and a locally-hosted large language model (LLM). </span>
            </h3>
          </div>
          <div class="card-footer py-4">
            <div class="d-inline-flex align-items-center position-relative me-3">
              <img src="assets/img/avatar/dimitri.jpeg" class="rounded-circle me-3" width="48" alt="Avatar">
              <div>
                <span class="nav-link p-0 fw-bold text-decoration-none stretched-link">Dimitrios Poulopoulos<br></span>
                <span class="fs-sm text-muted">Ezmeral R&D</span>
              </div>
            </div>
          </div>
        </article>
      </div>
      <div class="col">

        <!-- Article -->
        <article class="card card-hover border-0 shadow-sm overflow-hidden mb-4">
          <div class="row g-0">
            <div class="col-sm-5 position-relative bg-position-center bg-repeat-0 bg-size-cover" style="background-image: url(assets/img/demos/ua_demo1.jpg); min-height: 15rem;">
              <a style="pointer-events: none;" href="#" class="position-absolute top-0 start-0 w-100 h-100 stretched-link" aria-label="Read more"></a>
              <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-5 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Read later" data-bs-original-title="Read later">
                <i class="bx bx-bookmark"></i>
              </a> -->
            </div>
            <div class="col-sm-7">
              <div class="card-body">
                <div class="d-flex justify-content-between mb-3">
                  <div class="justify-content-between">
                  <a href="#" class="badge fs-sm text-nav coming-soon text-decoration-none">Coming Soon</a>
                  <a href="#" class="badge fs-sm text-nav bg-secondary text-decoration-none">Edge</a>
                  <a href="#" class="badge fs-sm text-nav bg-success text-decoration-none">Data Fabric</a>
                  </div>
                  <span class="fs-sm text-muted py-1">September 2023</span>
                </div>
                <h3 class="h4 mb-0">
                  <a class="stretched-link" style="pointer-events: none;" href="#">Retail Object Detection</a>
                </h3>
                <h3 class="h5 mt-2">
                <span style="font-family: 'MetricHPE-Light';">End-to-end data pipeline and model training use case on HPE Ezmeral Software stack.</span>
                </h3>
                <hr class="my-4">
                <div class="d-flex flex-sm-nowrap flex-wrap align-items-center justify-content-between">
                  <div class="d-flex align-items-center position-relative me-3">
                    <img src="assets/img/avatar/isabelle.jpeg" class="rounded-circle me-3" width="48" alt="Avatar">
                    <div>
                      <span class="nav-link p-0 fw-bold text-decoration-none stretched-link">Isabelle Steinhauser<br></span>
                      <span class="fs-sm text-muted">Ezmeral Solutions Engineer, DACH/CETA</span>
                    </div>
                  </div>
                  <!-- <div class="d-flex align-items-center mt-sm-0 mt-4 text-muted">
                    <div class="d-flex align-items-center me-3">
                      <i class="bx bx-like fs-lg me-1"></i>
                      <span class="fs-sm">8</span>
                    </div>
                    <div class="d-flex align-items-center me-3">
                      <i class="bx bx-comment fs-lg me-1"></i>
                      <span class="fs-sm">7</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="bx bx-share-alt fs-lg me-1"></i>
                      <span class="fs-sm">4</span>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="card card-hover border-0 shadow-sm overflow-hidden">
          <div class="row g-0">
            <div class="col-sm-5 position-relative bg-position-center bg-repeat-0 bg-size-cover" style="background-image: url(assets/img/demos/fraud_demo1.jpg); min-height: 15rem;">
              <a href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/demos/fraud-detection" class="position-absolute top-0 start-0 w-100 h-100 stretched-link" aria-label="Read more"></a>
              <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-5 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Read later" data-bs-original-title="Read later">
                <i class="bx bx-bookmark"></i>
              </a> -->
            </div>
            <div class="col-sm-7">
              <div class="card-body">
                <div class="d-flex justify-content-between mb-3">
                  <div class="justify-content-between">
                  <a href="" class="badge fs-sm text-nav bg-secondary text-decoration-none">Machine Learning</a>
                  <a href="" class="badge fs-sm text-nav bg-secondary text-decoration-none">Kale</a>
                  <a href="" class="badge fs-sm text-nav bg-success text-decoration-none"> Unified Analytics</a>
                </div>
                  <span class="fs-sm text-muted py-1">June 2023</span>
                </div>
                <h3 class="h4 mb-0">
                  <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/demos/fraud-detection">Transactional Fraud Detection</a>
                </h3>
                <h3 class="h5 mt-2">
                <span style="font-family: 'MetricHPE-Light';">HPE Ezmeral Unified Analytics Software bolsters transaction fraud detection, reliability and precision.</span>
                </h3>
                <hr class="my-4">
                <div class="d-flex flex-sm-nowrap flex-wrap align-items-center justify-content-between">
                  <div class="d-inline-flex align-items-center position-relative me-3">
                    <img src="assets/img/avatar/dimitri.jpeg" class="rounded-circle me-3" width="48" alt="Avatar">
                    <div>
                      <span class="nav-link p-0 fw-bold text-decoration-none stretched-link">Dimitrios Poulopoulos<br></span>
                      <span class="fs-sm text-muted">Ezmeral R&D</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

      </div>
      <!-- <div class="col-12 mt-4 pt-lg-4 pt-3 text-center">
        <a style="text-decoration: none;" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/E2E-Demos"><button href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/E2E-Demos" class="btn btn2 btn-outline-primary">
          See All Demos
          <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png">
        </button></a>
      </div> -->
    </div>
    </div>
  </section>


   <!-- CTA  -->
  <!-- <section class="bg-secondary mb-1 mb-md-3 mb-lg-4" style="background: url('assets/img/bg1.jpg'); background-size: cover; background-repeat: no-repeat; background-position: center center;"> -->
    <section class="bg-secondary mb-1 mb-md-3 mb-lg-4">
    <div class="container overflow-hidden py-5"> 
        <h2 class="h1 text-center text-md-start mb-lg-5 mb-3" style="font-family: 'MetricHPE-Regular'; font-weight: 400;">Quick links</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 gx-3 gx-md-4 mt-n2 mt-sm-0">

          <!-- Item -->
          <div class="col pb-1 pb-lg-3 mb-4">
            <div class="card card-hover border-0 shadow-sm h-100 mx-2">
              <div class="card-body">
                <!-- <div class="d-table position-relative p-3 mb-3">
                  <i class='bx bx-library ql-icon' style="font-size: 50px;"></i>
                  <span class="bg-primary position-absolute top-0 start-0 w-100 h-100 rounded-circle opacity-8"></span>
                </div> -->
                <h3 class="h3 pb-1 mb-2"><a href="https://docs.ezmeral.hpe.com">Documentation</a></h3>
                <p class="mb-0">Explore the HPE Ezmeral Software documentation on current and legacy products. </p> 
                <!-- with GeMA, the Ezmeral AI documentation assistant. -->
              </div>
              <div class="card-footer border-0 pt-3 pb-4">
                <a class="stretched-link" style="text-decoration: none;" href="https://docs.ezmeral.hpe.com">
                <button class="btn btn2 btn-outline-primary">
                  Explore Documentation 
                  <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png" alt="Arrow">
                </button>
              </a>
              </div>
            </div>
          </div>

          <!-- Item -->
          <div class="col pb-1 pb-lg-3 mb-4">
            <div class="card card-hover border-0 shadow-sm h-100 mx-2">
              <div class="card-body">
                <!-- <div class="d-table position-relative p-3 mb-4">
                  <i class='bx bx-group ql-icon' style="font-size: 60px;"></i>
                  <span class="bg-primary position-absolute top-0 start-0 w-100 h-100 rounded-circle opacity-8"></span>
                </div> -->
                <h3 class="h3 pb-1 mb-2"><a href="https://community.hpe.com/t5/hpe-ezmeral-software-platform/bd-p/ezmeral-software-platform">Community</a></h3>
                <p class="mb-0">The latest from the HPE Ezmeral Software community, including blog posts, release announcements and support forums.</p>
              </div>
              <div class="card-footer border-0 pt-3 pb-4">
                <a class="stretched-link" style="text-decoration: none;" href="https://community.hpe.com/t5/hpe-ezmeral-software-platform/bd-p/ezmeral-software-platform">
                <button class="btn btn2 btn-outline-primary">
                  Explore HPE Community
                  <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png" alt="Arrow">
                </button> </a>
              </div>
            </div>
          </div>

          <!-- Item -->
          <!-- <div class="col pb-1 pb-lg-3 mb-4">
            <div class="card card-hover h-100 border-0 shadow-sm mx-2">
              <div class="card-body">

                <h3 class="h3 pb-1 mb-2">Quick Start</h3>

                <p class="mb-0">Get started with HPE Ezmeral Software with our Quick Start guides. Find installer downloads and Getting Started guides here.</p>
              </div>
              <div class="card-footer border-0 pt-3 pb-4">
                <button href="" class="btn btn2 coming-soon btn-outline-secondary">
                  Coming Soon
                </button>

              </div>
            </div>
          </div> -->

            <!-- Item -->
            <!-- <div class="col pb-1 pb-lg-3 mb-4">
              <div class="card card-hover border-0 shadow-sm h-100 mx-2">
                <div class="card-body">

                  <h3 class="h3 pb-1 mb-2"><a href="https://docs.ezmeral.hpe.com">Press Releases</a></h3>
                  <p class="mb-0">Browse through webinars, solution briefs, reports and technical whitepapers.</p> 

                </div>
                <div class="card-footer border-0 pt-3 pb-4">
                  <a class="stretched-link" style="text-decoration: none;" href="https://docs.ezmeral.hpe.com">
                  <button class="btn btn2 btn-outline-primary">
                    Resource Hub 
                    <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png">
                  </button>
                </a>
                </div>
              </div>
            </div> -->
  
            <!-- Item -->
            <!-- <div class="col pb-1 pb-lg-3 mb-4">
              <div class="card card-hover border-0 shadow-sm h-100 mx-2">
                <div class="card-body">

                  <h3 class="h3 pb-1 mb-2"><a href="https://community.hpe.com/t5/hpe-ezmeral-software-platform/bd-p/ezmeral-software-platform">Customer Stories</a></h3>
                  <p class="mb-0">Learn how HPE Ezmeral Software has empowered some of the largest enterprises to manage, leverage and use their data.</p>
                </div>
                <div class="card-footer border-0 pt-3 pb-4">
                  <a class="stretched-link" style="text-decoration: none;" href="https://community.hpe.com/t5/hpe-ezmeral-software-platform/bd-p/ezmeral-software-platform">
                  <button class="btn btn2 btn-outline-primary">
                    Explore Customer Stories
                    <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png">
                  </button> </a>
                </div>
              </div>
            </div> -->
  
            <!-- Item -->
            <div class="col pb-1 pb-lg-3 mb-4">
              <div class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="card-body">
                  <h3 class="h3 pb-1 mb-2">Github <i class="bx bxl-github" style="font-size: 24px;"></i></h3>

                  <p class="mb-0">The HPE Ezmeral Software Github features repositories containing demos, tutorials and specific use case libraries.</p>
                </div>
                <div class="card-footer border-0 pt-3 pb-4">

                  <a class="stretched-link" style="text-decoration: none;" href="https://github.com/HPEEzmeral"></a>

                  <button href="https://github.com/HPEEzmeral" class="btn btn2 btn-outline-primary">
                    Explore Github
                    <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png" alt="Arrow">
                  </button>

                </div>
              </div>
            </div>
            
    
          </div>
        </div>
  </section>

  <!-- TUTORIALS -->

  <section class="mt-2 mt-sm-3 py-md-3 py-lg-5 mb-5">
    <div class="container">
      <h2 class="h1 text-center text-md-start mb-lg-4" style="font-family: 'MetricHPE-Regular'; font-weight: 400;">Learn on Ezmeral</h2>
      <div class="row align-items-center pb-5">
        <div class="col-md-9 col-lg-8 col-xl-7 text-center text-md-start">
          <p class="fs-xl text-muted mb-md-0">Learn how to use the full suite of tools and frameworks available in HPE Ezmeral Software.</p>
        </div>
          <div class="col-md-3 col-lg-4 col-xl-5 d-flex justify-content-center justify-content-md-end">
            <a style="text-decoration: none;" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/tutorials"><button href="https://github.com/HPEEzmeral/ezua-tutorials/tree/develop/tutorials" class="btn btn2 btn-outline-primary">
              View all on Github
              <i class="bx bxl-github" style="margin-top: 2px; margin-left: 7px; font-size: 24px;"></i>
            </button></a>            </div>
      </div>
    <div class="tutorial-container row py-5">
      <div class="col-lg-3 col-md-4 mt-5">

        <!-- Nav tabs -->
        <ul class="nav nav-tabs flex-nowrap overflow-auto flex-md-column pb-2 pb-md-0 mb-3 mb-md-5 mt-2" role="tablist">
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag active" role="tab" aria-selected="true">All</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="true">Data Fabric</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="false">Unified Analytics</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="false">Data Engineering</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="false">Data Science</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="false">Machine Learning</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="false">Model Serving</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-inline-block text-nowrap btn-tag" role="tab" aria-selected="false">Kubernetes</a>
          </li>
        </ul>

      </div>
      <div class="col-lg-9 col-md-8">
        <!-- Title + prev/next buttons -->
        <div class="d-flex align-items-center justify-content-between pb-4 mb-3">
          <h2 class="h2 mb-0 me-3 tutorial-title">All</h2>
          <div class="d-flex">
            <button type="button" id="popular-prev" class="btn btn-prev btn-icon btn-sm me-2 swiper-button-disabled" disabled="" tabindex="-1" aria-label="Previous slide" aria-controls="swiper-wrapper-6a75507dc16cd77a" aria-disabled="true">
              <i class="bx bx-chevron-left"></i>
            </button>
            <button type="button" id="popular-next" class="btn btn-next btn-icon btn-sm ms-2" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-6a75507dc16cd77a" aria-disabled="false">
              <i class="bx bx-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Courses slider -->
        <div class="swiper swiper-nav-onhover mx-n2 swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden" style="overflow-y:visible; overflow-x:clip;" data-swiper-options="{
          &quot;slidesPerView&quot;: 1,
          &quot;spaceBetween&quot;: 8,
          &quot;pagination&quot;: {
            &quot;el&quot;: &quot;.swiper-pagination&quot;,
            &quot;clickable&quot;: true
          },
          &quot;navigation&quot;: {
            &quot;prevEl&quot;: &quot;#popular-prev&quot;,
            &quot;nextEl&quot;: &quot;#popular-next&quot;
          },
          &quot;breakpoints&quot;: {
            &quot;560&quot;: {
              &quot;slidesPerView&quot;: 2
            },
            &quot;768&quot;: {
              &quot;slidesPerView&quot;: 1
            },
            &quot;850&quot;: {
              &quot;slidesPerView&quot;: 2
            },
            &quot;1200&quot;: {
              &quot;slidesPerView&quot;: 3
            }
          }
        }">
          <div class="swiper-wrapper" id="swiper-wrapper-6a75507dc16cd77a" aria-live="polite" style="transform: translate3d(0px, 0px, 0px);">

            <!-- Item -->
            <div class="swiper-slide h-auto pb-3 panel" id="tutorial1" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/spark.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Spark">
                  <img src="assets/img/unifiedanalytics/spark-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Spark">
                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Analytics/Spark">Introduction to Apache Spark on HPE Ezmeral Software Unified Analytics</a>
                  </h3>
                  <p class="fs-sm mb-2">Extract data from S3 Object Store, transform it, and load it to EzDF.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Engineering</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Spark</a>
                  </div>
                </div>
              </article>
            </div>

            <div class="swiper-slide h-auto pb-3 panel" id="tutorial2" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/spark.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Spark">
                  <img src="assets/img/unifiedanalytics/spark-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Spark">
                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Analytics/Spark-GPU">Apache Spark on GPUs</a>
                  </h3>
                  <p class="fs-sm mb-2">Learn to run a Spark SQL query through a GPU.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Engineering</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Spark</a>
                  </div>
                </div>
              </article>
            </div>

            <div class="swiper-slide h-auto pb-3 panel" id="tutorial3" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/airflow.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Airflow">
                  <img src="assets/img/unifiedanalytics/airflow-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Airflow">
                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Engineering/Airflow">Introduction to Apache Airflow: Financial Time Series ETL</a>
                  </h3>
                  <p class="fs-sm mb-2">Read a CSV file from an S3 bucket, convert it to parquet, and write it to a volume in HPE Ezmeral Software Data Fabric.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Data Fabric</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Engineering</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Airflow</a>
                  </div>
                </div>
              </article>
            </div>

            <!-- Item -->
            <div class="swiper-slide h-auto pb-3 panel" id="tutorial4" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/presto.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Presto" >
                  <img src="assets/img/unifiedanalytics/presto-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Presto">
                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Engineering/PrestoDB">Introduction to Presto on HPE Ezmeral Software Unified Analytics</a>
                  </h3>
                  <p class="fs-sm mb-2">In this introductory tutorial, you will learn how to get the content and schema of an SQL table using a PrestoDB query.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Engineering</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Presto</a>
                  </div>
                </div>
              </article>
            </div>

            <!-- Item -->

            <div class="swiper-slide h-auto pb-3 panel" id="tutorial5" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/feast.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Feast">
                  <img src="assets/img/unifiedanalytics/feast-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Feast">
                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Science/Feast">Deliver a Ride Sharing Prediction Model with Feast</a>
                  </h3>
                  <p class="fs-sm mb-2">Deliver training data and power an inference service for a ride-sharing driver satisfaction prediction model.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Science</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Model Serving</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Machine Learning</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Feast</a>
                  </div>
                </div>
              </article>
            </div>

          <!-- Item -->

          <div class="swiper-slide h-auto pb-3 panel" id="tutorial6" role="group" style="width: 290.5px; margin-right: 8px;">
            <article class="card card-hover h-100 border-0 shadow-sm mx-2">
              <div class="position-relative text-center mt-3">
                <a href="https://github.com/HPEEzmeral/ezua-tutorials/blob/release/fy23-q3/Data-Science/Kubeflow/Financial-Time-Series" class="d-block position-absolute w-100 h-100 top-0 start-0"></a>
                <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                  <i class="bx bx-bookmark"></i>
                </a> -->
                <img src="assets/img/unifiedanalytics/kubeflow.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Kubeflow">
                <img src="assets/img/unifiedanalytics/kubeflow-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Kubeflow">
            </div>
              <div class="card-body pb-3">
                <h3 class="h4 mb-2">
                  <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/blob/release/fy23-q3/Data-Science/Kubeflow/Financial-Time-Series">Introduction to Kubeflow: Financial Time Series</a>
                </h3>
                <p class="fs-sm mb-2">Learn to build, train, and evaluate a number of models for predicting stock markets on HPE Ezmeral Software Unified Analytics.</p>
                <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
              </div>
              <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                <div class="panel-footer tag">
                  <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                  <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                  <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Science</a>
                  <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Machine Learning</a>
                  <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Kubernetes</a>
                  <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Kubeflow</a>


                </div>
              </div>
            </article>
          </div>



            <!-- Item -->

            <div class="swiper-slide h-auto pb-3 panel" id="tutorial7" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <a href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Science/Ray-GPU" class="d-block position-absolute w-100 h-100 top-0 start-0"></a>
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/ray.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Ray">
                  <img src="assets/img/unifiedanalytics/ray-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Ray">

                </div>
                <div class="card-body pb-2">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Science/Ray-GPU">Introduction to Ray: Matrix Multiplication</a>
                  </h3>
                  <p class="fs-sm mb-2">Learn how to use Ray on HPE Ezmeral Software Unified Analytics. In this tutorial, you will learn to calculate the squares of a list of mumbers on a GPU cluster using Ray.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Science</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Ray</a>
                  </div>
                </div>
              </article>
            </div>

            <!-- Item -->

            <div class="swiper-slide h-auto pb-3 panel" id="tutorial7" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <a href="1.	https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/E2E-Demos/Question-Answering" class="d-block position-absolute w-100 h-100 top-0 start-0"></a>
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/kubeflow.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="Kubeflow">
                  <img src="assets/img/unifiedanalytics/kubeflow-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="Kubeflow">

                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/E2E-Demos/Question-Answering">Locally-hosted and served LLM Q&A on Private Documentation</a>
                  </h3>
                  <p class="fs-sm mb-2">Deploy an open-source Large Language Model (LLM) that is capable of answering questions over a corpus of private documentation. </p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Machine Learning</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Model Serving</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Kubeflow</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">Ray</a>
                  </div>
                </div>
              </article>
            </div>                
            
            <!-- Item -->


            <div class="swiper-slide h-auto pb-3 panel" id="tutorial8" role="group" style="width: 290.5px; margin-right: 8px;">
              <article class="card card-hover h-100 border-0 shadow-sm mx-2">
                <div class="position-relative text-center mt-3">
                  <a href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Science/MLflow" class="d-block position-absolute w-100 h-100 top-0 start-0"></a>
                  <!-- <span class="badge bg-success position-absolute top-0 start-0 zindex-2 mt-3 ms-3">Best Seller</span> -->
                  <!-- <a href="#" class="btn btn-icon btn-light bg-white border-white btn-sm rounded-circle position-absolute top-0 end-0 zindex-2 me-3 mt-3" data-bs-toggle="tooltip" data-bs-placement="left" aria-label="Save to Favorites" data-bs-original-title="Save to Favorites">
                    <i class="bx bx-bookmark"></i>
                  </a> -->
                  <img src="assets/img/unifiedanalytics/mlflow.png" width="20px" class="d-dark-mode-none d-inline card-img-top tutorial-img" alt="MLflow" >
                  <img src="assets/img/unifiedanalytics/mlflow-dark.png" width="20px" class="d-dark-mode-inline d-none card-img-top tutorial-img" alt="MLflow">

                </div>
                <div class="card-body pb-3">
                  <h3 class="h4 mb-2">
                    <a class="stretched-link" href="https://github.com/HPEEzmeral/ezua-tutorials/tree/release/fy23-q3/Data-Science/MLflow">Introduction to MLFlow: Bike Sharing Prediction</a>
                  </h3>
                  <p class="fs-sm mb-2">In this tutorial, you will learn how to use MLFlow on HPE Ezmeral Software Unified Analytics to construct a predictive model capable of forecasting bike rental demand.</p>
                  <!-- <p class="fs-lg fw-semibold text-primary mb-0">$12.50</p> -->
                </div>
                <div class="card-footer d-flex align-items-center fs-sm text-muted py-4">
                  <div class="panel-footer tag">
                    <a href="#" class="label hidden badge fs-sm text-nav bg-secondary text-decoration-none">All</a>
                    <a href="#" class="label badge fs-sm text-nav bg-success text-decoration-none">Unified Analytics</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Data Science</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Machine Learning</a>
                    <a href="#" class="label badge fs-sm text-nav bg-info text-decoration-none">Kubernetes</a>
                    <a href="#" class="label badge fs-sm text-nav bg-secondary text-decoration-none">MLFlow</a>
                  </div>
                </div>
              </article>
            </div>
            <!-- Item -->

          </div>

          <!-- Pagination (bullets) -->
          <div class="swiper-pagination position-relative pt-2 pt-sm-3 mt-4 swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"><span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide 1" aria-current="true"></span><span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 2"></span><span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 3"></span><span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 4"></span></div>
        <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
        <a href="portfolio-courses.html" class="btn btn-outline-primary btn-lg w-100 d-md-none mt-3">
          See all courses
          <i class="bx bx-right-arrow-alt fs-xl ms-2"></i>
        </a>
      </div>
      
    </div>
  </div>

  </section>

  <!-- PRODUCT -->
  <section style="height: 100px;">
    <div>
    </div>
    </section>
  <section class="bg-secondary py-5">
    <div class="container my-xl-5 my-lg-4 pb-2 py-sm-3 py-md-4">
      <div class="row my-2">
        <div class="col-xl-4 col-lg-5">
          <div class="mb-lg-0 mb-5 mx-lg-0 mx-auto text-lg-start text-center" style="max-width: 26rem;">
            <h3 class="mb-4 pb-3">HPE <span class="main-title-subtext" style="margin-left:0px; font-family: 'MetricHPE-Regular';">Ezmeral Software</span><br><br>
              <h1>It's your data. <br><span class="ezmeral-title">Your way.</span>
            </h1>
            <p class="mb-4">HPE Ezmeral Software empowers enterprises to break free from data silos, unlocking AI-driven insights seamlessly across the entire organization regardless of where data may reside.<br><br></p>
            <a style="text-decoration: none;" href="mailto:mario.gonzalez@hpe.com?subject=HPE Ezmeral Software Inquiry&body=I'm reaching out to explore the potential of HPE Ezmeral Software for addressing our organization's evolving needs. [insert business name here] is interested in better understanding how Ezmeral can contribute to our overall data infrastructure and AI/ML objectives. To better assess its suitability, we'd appreciate the opportunity to schedule a discussion or demonstration to delve into key aspects such as product features, use cases, pricing, support, and integration."><button href="#demo" class="btn btn2 btn-outline-primary">
              Get in touch
              <!-- <img style="height:18px; margin-left:3px;" src="assets/img/hpe-arrow-right.png" alt="Arrow"> -->
              <i class="bx bx-mail-send mt-1 mx-1"></i>
            </button></a>
          </div>
        </div>
        <div class="col-lg-7 offset-xl-1">
          <div class="row row-cols-sm-2 row-cols-1 gy-4">

            <!-- Item -->
            <div class="col">
              <div class="card card-hover border-0 shadow position-relative">
                <img src="assets/img/unifiedanalytics/data-fabric-light.png" class="d-dark-mode-none d-inline card-img-top" alt="Data Fabric">
                <img src="assets/img/unifiedanalytics/data-fabric.png" class="d-dark-mode-inline d-none card-img-top" alt="Data Fabric">                    
                <div class="card-body mt-n5 mx-3 mb-3 pt-0 text-center">
                  <span class="main-title-text">HPE</span><span class="main-title-subtext">Ezmeral Software</span>
                  <h5 class="mb-3">Data Fabric</h5> 
                  <p class="mb-4">Modern data foundation across hybrid cloud to seamlessly access, analyze, and govern data globally.</p>

                  <a style="text-decoration: none;" href="https://www.hpe.com/us/en/hpe-ezmeral-data-fabric.html"><button href="https://www.hpe.com/us/en/hpe-ezmeral-data-fabric.html" class="btn btn2 btn-outline-primary stretched-link">
                    Learn More
                  </button></a>
                </div>
              </div>
            </div>

            <!-- Item -->
            <div class="col">
              <div class="card card-hover border-0 shadow position-relative">
                <img src="assets/img/unifiedanalytics/unified-analytics-light.png" class="d-dark-mode-none d-inline card-img-top" alt="Unified Analytics">
                <img src="assets/img/unifiedanalytics/unified-analytics.png" class="d-dark-mode-inline d-none card-img-top" alt="Unified Analytics" >
                <div class="card-body mt-n5 mx-3 mb-3 pt-0 text-center">
                  <span class="main-title-text">HPE</span><span class="main-title-subtext">Ezmeral Software</span>
                  <h5 class="mb-3">Unified Analytics</h5> 
                  <p class="mb-4">Unlock data and insights faster by helping you develop and deploy data analytics, models and AI. </p>

                  <a style="text-decoration: none;" href="https://www.hpe.com/us/en/hpe-ezmeral-unified-analytics.html"><button href="https://www.hpe.com/us/en/hpe-ezmeral-unified-analytics.html" class="btn btn2 btn-outline-primary stretched-link">
                    Learn More
                  </button></a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>

  <section style="height: 200px;">
  <div>
  </div>
  </section>
  

  <div id="footer" class="footer">
  </div>
</main>



<!-- Back to top button -->
<a href="#top" class="btn-scroll-top" data-scroll>
  <span class="btn-scroll-top-tooltip text-muted fs-sm me-2">Top</span>
  <i class="btn-scroll-top-icon bx bx-chevron-up"></i>
</a>


<!-- Vendor Scripts -->
<script src="assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js"></script>
<script src="assets/vendor/jarallax/dist/jarallax.min.js"></script>
<script src="assets/vendor/rellax/rellax.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script>

<!-- Main Theme Script -->
<script src="assets/js/theme.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
// VANTA.WAVES({
//   el: "#vanta-canvas",
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   minHeight: 200.00,
//   minWidth: 200.00,
//   scale: 1.00,
//   scaleMobile: 1.00,
//   color: 0x8567,
//   shininess: 51.00, /* Default: 30.0 */
//   waveHeight: 39.00, /* Default: 15.0 */
//   waveSpeed: 0.45, /* Default: 1.0 */
//   zoom: 1.0 /* Default: 1.0 */
// })


$(document).ready(function() {
```

$(".btn-tag").click(function(eventObject) {
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
  var tag = $(this).html();
  var totalPanel = document.getElementsByClassName("panel").length;
  console.log(totalPanel); 
  eventObject.preventDefault();
  if (tag == "Data Fabric" || tag == "Unified Analytics"){
    $(".tutorial-title").html("HPE " + '<span class="main-title-subtext mx-1">E Z M E R A L</span>'+ " " + tag);
  }
  else {
  $(".tutorial-title").text(tag);
  }
  for (var x = 1; x <= totalPanel; x++  ){
    console.log("json: " + JSON.stringify($("#tutorial" + x ).html()));
    if(JSON.stringify($("#tutorial" + x ).html()).indexOf(tag) >= 0 ){
      //console.log( JSON.stringify($("#project" + x ).html()) );
      $("#tutorial" + x ).hide();
      $("#tutorial" + x ).fadeIn();
    } else {
      $("#tutorial" + x ).hide();
    };
    //console.log(tag);
    //console.log(JSON.stringify($("#project" + x ).html()).indexOf(tag));
  }
  //console.log(tag);

});

//console.log("total panel: " + document.getElementsByClassName("panel").length );

});


</html>