import React from "react";

const fisatCampusImage = "https://www.bing.com/th/id/OIP.ZHKlnfd89tVcuhUFcrA7qAHaE5?w=193&h=135&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2";

export default function Home() {
  return (
    <div style={styles.page}>

      {/* =====================================================
          TOP CONTACT BAR
      ===================================================== */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <span>
            <i className="fas fa-phone-alt" style={styles.yellowIcon}></i>
            0484-2725272, 8547704139
          </span>

          <span style={{ marginLeft: "20px" }}>
            <i className="fas fa-envelope" style={styles.yellowIcon}></i>
            mail@fisat.ac.in
          </span>
        </div>

        <div style={styles.topBarRight}>
          <span>
            <i
              className="fas fa-map-marker-alt"
              style={styles.yellowIcon}
            ></i>
            Hormis Nagar, Mookkannoor P.O, Angamaly, Kerala - 683577
          </span>
        </div>
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}
      <header style={styles.header}>

        <div style={styles.logoSection}>

          <div style={styles.universityIconBox}>
            <img
              src={fisatCampusImage}
              alt="FISAT Campus"
              style={styles.headerCampusImage}
            />
          </div>

          <div>
            <h1 style={styles.mainTitle}>
              FISAT BUS MANAGEMENT SYSTEM
            </h1>

            <p style={styles.subtitle}>
              Federal Institute of Science and Technology
            </p>
          </div>

        </div>


        {/* NAVIGATION */}
        <nav>
          <ul style={styles.navList}>

            <li>
              <a
                href="https://fisat.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.navLink}
              >
                About
              </a>
            </li>

            <li>
              <a
                href="https://fisat.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.navLink}
              >
                Campus
              </a>
            </li>

            <li>
              <a
                href="https://fisat.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.navLink}
              >
                Portals
              </a>
            </li>

            <li>
              <a
                href="https://fisat.ac.in/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.navLink}
              >
                Contact Us
              </a>
            </li>

          </ul>
        </nav>

      </header>


      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section style={styles.hero}>

        <div style={styles.heroOverlay}></div>

        <div style={styles.heroContent}>

          <div style={styles.heroBusIcon}>
            <i className="fas fa-bus"></i>
          </div>

          <p style={styles.heroSmallTitle}>
            FISAT TRANSPORTATION SERVICES
          </p>

          <h2 style={styles.heroTitle}>
            Smart & Reliable
            <br />
            College Bus Management
          </h2>

          <p style={styles.heroText}>
            A centralized transportation management system for
            students, staff, administrators, and FISAT bus services.
          </p>

          <div style={styles.heroButtons}>

            <a
              href="/student-login"
              style={styles.heroPrimaryButton}
            >
              <i
                className="fas fa-user-graduate"
                style={{ marginRight: "8px" }}
              ></i>
              Student Portal
            </a>

             <a
              href="/staff-login"
              style={styles.heroPrimaryButton}
            >
              <i
                className="fas fa-user-graduate"
                style={{ marginRight: "8px" }}
              ></i>
              Staff Portal
            </a>

             <a
              href="/adminlogin"
              style={styles.heroPrimaryButton}
            >
              <i
                className="fas fa-user-graduate"
                style={{ marginRight: "8px" }}
              ></i>
              Admin Portal
            </a>
            
            <a
              href="https://fisat.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.heroPrimaryButton}
            >
              Explore FISAT
              <i
                className="fas fa-external-link-alt"
                style={{ marginLeft: "8px" }}
              ></i>
            </a>
            

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT SECTION
      ===================================================== */}
      <section style={styles.aboutContainer}>

        <div style={styles.aboutCard}>

          <div style={styles.aboutText}>

            <div style={styles.sectionLabel}>
              ABOUT FISAT
            </div>

            <h3 style={styles.sectionTitle}>
              About Our Institution
            </h3>

            <p>
              <strong>
                Federal Institute of Science and Technology (FISAT)
              </strong>{" "}
              is a professional educational institution located at
              Hormis Nagar, Mookkannoor, near Angamaly in Kerala.
            </p>

            <p>
              FISAT provides a modern educational environment with
              facilities and transportation services designed to
              support students and staff.
            </p>

            <p>
              Our bus management system helps organize routes,
              schedules, bus information, student access and
              transportation monitoring through a centralized
              digital platform.
            </p>

            <a
              href="https://fisat.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.readMoreButton}
            >
              Visit FISAT Website
              <i
                className="fas fa-external-link-alt"
                style={{ marginLeft: "8px" }}
              ></i>
            </a>

          </div>


          {/* FISAT CAMPUS VISUAL */}
          <div style={styles.aboutVisual}>

            <div style={styles.campusImageWrapper}>

              <img
                src={fisatCampusImage}
                alt="Federal Institute of Science and Technology Campus"
                style={styles.campusImage}
              />

              <div style={styles.campusImageLabel}>
                <i
                  className="fas fa-university"
                  style={{ marginRight: "8px" }}
                ></i>
                FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BUS FLEET SECTION
      ===================================================== */}
      <section style={styles.busSection}>

        <div style={styles.busHeading}>

          <div style={styles.busIconCircle}>
            <i
              className="fas fa-bus"
              style={styles.busHeadingIcon}
            ></i>
          </div>

          <div style={styles.sectionLabel}>
            TRANSPORTATION SERVICES
          </div>

          <h3 style={styles.busSectionTitle}>
            Bus Fleet & Transportation Network
          </h3>

          <p style={styles.busSectionSubtitle}>
            Safe, reliable, and well-connected transportation
            solutions for FISAT students and staff
          </p>

        </div>


        {/* =====================================================
            THREE BUS CARDS
        ===================================================== */}
        <div style={styles.busGrid}>


          {/* =================================================
              CARD 1 - COMFORTABLE FLEET
          ================================================= */}
          <div style={styles.busCard}>

            <div style={styles.imageContainer}>

              {/* SELF-CONTAINED COLLEGE BUS ILLUSTRATION */}
              <svg
                viewBox="0 0 800 460"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.svgImage}
              >

                <defs>
                  <linearGradient
                    id="fleetSky"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#b9e5ff"
                    />
                    <stop
                      offset="100%"
                      stopColor="#eef8ff"
                    />
                  </linearGradient>

                  <linearGradient
                    id="fleetRoad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#65727c"
                    />
                    <stop
                      offset="100%"
                      stopColor="#303841"
                    />
                  </linearGradient>
                </defs>


                {/* SKY */}
                <rect
                  width="800"
                  height="460"
                  fill="url(#fleetSky)"
                />

                {/* CLOUDS */}
                <circle
                  cx="120"
                  cy="80"
                  r="35"
                  fill="#ffffff"
                  opacity="0.75"
                />

                <circle
                  cx="155"
                  cy="75"
                  r="45"
                  fill="#ffffff"
                  opacity="0.75"
                />

                <circle
                  cx="195"
                  cy="88"
                  r="30"
                  fill="#ffffff"
                  opacity="0.75"
                />


                {/* TREES */}
                <rect
                  x="0"
                  y="275"
                  width="800"
                  height="50"
                  fill="#7ca96c"
                />

                <circle
                  cx="80"
                  cy="260"
                  r="55"
                  fill="#3d8150"
                />

                <circle
                  cx="730"
                  cy="260"
                  r="65"
                  fill="#3d8150"
                />

                <circle
                  cx="650"
                  cy="270"
                  r="45"
                  fill="#4d965c"
                />


                {/* ROAD */}
                <rect
                  x="0"
                  y="325"
                  width="800"
                  height="135"
                  fill="url(#fleetRoad)"
                />

                {/* ROAD MARKINGS */}
                <rect
                  x="20"
                  y="385"
                  width="100"
                  height="8"
                  fill="#ffffff"
                />

                <rect
                  x="180"
                  y="385"
                  width="100"
                  height="8"
                  fill="#ffffff"
                />

                <rect
                  x="340"
                  y="385"
                  width="100"
                  height="8"
                  fill="#ffffff"
                />

                <rect
                  x="500"
                  y="385"
                  width="100"
                  height="8"
                  fill="#ffffff"
                />

                <rect
                  x="660"
                  y="385"
                  width="100"
                  height="8"
                  fill="#ffffff"
                />


                {/* BUS BODY */}
                <rect
                  x="160"
                  y="205"
                  width="500"
                  height="145"
                  rx="18"
                  fill="#f5b900"
                  stroke="#172b43"
                  strokeWidth="7"
                />

                {/* BUS ROOF */}
                <rect
                  x="175"
                  y="190"
                  width="470"
                  height="35"
                  rx="15"
                  fill="#172b43"
                />


                {/* WINDOWS */}
                <rect
                  x="200"
                  y="230"
                  width="75"
                  height="55"
                  rx="5"
                  fill="#bfe7f7"
                  stroke="#172b43"
                  strokeWidth="4"
                />

                <rect
                  x="285"
                  y="230"
                  width="75"
                  height="55"
                  rx="5"
                  fill="#bfe7f7"
                  stroke="#172b43"
                  strokeWidth="4"
                />

                <rect
                  x="370"
                  y="230"
                  width="75"
                  height="55"
                  rx="5"
                  fill="#bfe7f7"
                  stroke="#172b43"
                  strokeWidth="4"
                />

                <rect
                  x="455"
                  y="230"
                  width="75"
                  height="55"
                  rx="5"
                  fill="#bfe7f7"
                  stroke="#172b43"
                  strokeWidth="4"
                />

                <rect
                  x="540"
                  y="230"
                  width="75"
                  height="55"
                  rx="5"
                  fill="#bfe7f7"
                  stroke="#172b43"
                  strokeWidth="4"
                />


                {/* FRONT */}
                <path
                  d="M160 285 L125 315 L125 340 L160 340 Z"
                  fill="#e4aa00"
                  stroke="#172b43"
                  strokeWidth="6"
                />

                <rect
                  x="130"
                  y="295"
                  width="30"
                  height="25"
                  rx="5"
                  fill="#bfe7f7"
                />


                {/* DOOR */}
                <rect
                  x="535"
                  y="290"
                  width="65"
                  height="60"
                  fill="#172b43"
                />

                <line
                  x1="567"
                  y1="290"
                  x2="567"
                  y2="350"
                  stroke="#ffffff"
                  strokeWidth="3"
                />


                {/* WHEELS */}
                <circle
                  cx="245"
                  cy="355"
                  r="42"
                  fill="#111827"
                />

                <circle
                  cx="245"
                  cy="355"
                  r="18"
                  fill="#9ca3af"
                />

                <circle
                  cx="565"
                  cy="355"
                  r="42"
                  fill="#111827"
                />

                <circle
                  cx="565"
                  cy="355"
                  r="18"
                  fill="#9ca3af"
                />


                {/* BUS LABEL */}
                <rect
                  x="265"
                  y="295"
                  width="235"
                  height="32"
                  rx="6"
                  fill="#172b43"
                />

                <text
                  x="382"
                  y="318"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  FISAT COLLEGE BUS
                </text>

              </svg>


              <div style={styles.imageOverlay}>
                <i className="fas fa-bus"></i>
                <span>College Bus Fleet</span>
              </div>

            </div>


            <div style={styles.cardContent}>

              <div style={styles.smallIconCircle}>
                <i
                  className="fas fa-bus"
                  style={styles.darkIcon}
                ></i>
              </div>

              <h4 style={styles.cardTitle}>
                Comfortable Fleet
              </h4>

              <p style={styles.cardText}>
                A dedicated fleet of well-maintained college
                buses providing safe, comfortable, and reliable
                daily transportation for students and staff.
              </p>

              <div style={styles.cardFooter}>
                <span>
                  <i
                    className="fas fa-check-circle"
                    style={{
                      color: "#28a745",
                      marginRight: "7px",
                    }}
                  ></i>

                  Safe Transportation
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
              CARD 2 - WIDE ROUTE COVERAGE
          ================================================= */}
          <div style={styles.busCard}>

            <div style={styles.imageContainer}>

              {/* SELF-CONTAINED ROUTE MAP
                  NO EXTERNAL IMAGE
              */}
              <svg
                viewBox="0 0 800 460"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.svgImage}
              >

                <defs>

                  <linearGradient
                    id="routeBackground"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#dff3ff"
                    />

                    <stop
                      offset="100%"
                      stopColor="#eef5e9"
                    />
                  </linearGradient>

                </defs>


                {/* MAP BACKGROUND */}
                <rect
                  width="800"
                  height="460"
                  fill="url(#routeBackground)"
                />


                {/* MAP AREA SHAPES */}
                <path
                  d="M0 90
                     C120 40 200 80 290 55
                     C390 30 490 90 580 55
                     C680 20 750 60 800 35
                     L800 0 L0 0 Z"
                  fill="#c9e7b6"
                  opacity="0.6"
                />

                <path
                  d="M0 430
                     C130 360 190 400 280 370
                     C400 330 470 420 580 385
                     C690 350 740 400 800 370
                     L800 460 L0 460 Z"
                  fill="#cce5bc"
                  opacity="0.7"
                />


                {/* SMALL ROADS */}
                <path
                  d="M40 370
                     C140 320 170 210 300 220
                     S430 315 520 220
                     S650 125 750 135"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="48"
                />

                <path
                  d="M40 370
                     C140 320 170 210 300 220
                     S430 315 520 220
                     S650 125 750 135"
                  fill="none"
                  stroke="#b8c5cc"
                  strokeWidth="34"
                />


                {/* SECOND ROAD */}
                <path
                  d="M90 75
                     C190 120 275 105 355 165
                     S525 315 710 385"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="40"
                />

                <path
                  d="M90 75
                     C190 120 275 105 355 165
                     S525 315 710 385"
                  fill="none"
                  stroke="#c4ced4"
                  strokeWidth="27"
                />


                {/* ROUTE 1 */}
                <path
                  d="M45 370
                     C140 320 170 210 300 220
                     S430 315 520 220
                     S650 125 750 135"
                  fill="none"
                  stroke="#0c2340"
                  strokeWidth="9"
                  strokeLinecap="round"
                />


                {/* ROUTE 2 */}
                <path
                  d="M90 75
                     C190 120 275 105 355 165
                     S525 315 710 385"
                  fill="none"
                  stroke="#ffc107"
                  strokeWidth="9"
                  strokeLinecap="round"
                />


                {/* ROUTE 3 */}
                <path
                  d="M300 220
                     L355 165
                     L520 220"
                  fill="none"
                  stroke="#dc3545"
                  strokeWidth="8"
                  strokeDasharray="12 8"
                />


                {/* ROUTE STOPS */}

                <circle
                  cx="45"
                  cy="370"
                  r="12"
                  fill="#0c2340"
                  stroke="#ffffff"
                  strokeWidth="5"
                />

                <circle
                  cx="170"
                  cy="280"
                  r="12"
                  fill="#0c2340"
                  stroke="#ffffff"
                  strokeWidth="5"
                />

                <circle
                  cx="300"
                  cy="220"
                  r="16"
                  fill="#ffc107"
                  stroke="#0c2340"
                  strokeWidth="5"
                />

                <circle
                  cx="430"
                  cy="300"
                  r="12"
                  fill="#0c2340"
                  stroke="#ffffff"
                  strokeWidth="5"
                />

                <circle
                  cx="520"
                  cy="220"
                  r="13"
                  fill="#dc3545"
                  stroke="#ffffff"
                  strokeWidth="5"
                />

                <circle
                  cx="650"
                  cy="150"
                  r="12"
                  fill="#0c2340"
                  stroke="#ffffff"
                  strokeWidth="5"
                />

                <circle
                  cx="750"
                  cy="135"
                  r="15"
                  fill="#28a745"
                  stroke="#ffffff"
                  strokeWidth="5"
                />


                {/* LOCATION LABELS */}

                <text
                  x="20"
                  y="410"
                  fontSize="17"
                  fontWeight="700"
                  fill="#0c2340"
                >
                  Angamaly
                </text>

                <text
                  x="130"
                  y="255"
                  fontSize="17"
                  fontWeight="600"
                  fill="#0c2340"
                >
                  Aluva
                </text>

                <text
                  x="270"
                  y="190"
                  fontSize="19"
                  fontWeight="800"
                  fill="#0c2340"
                >
                  FISAT
                </text>

                <text
                  x="380"
                  y="330"
                  fontSize="16"
                  fontWeight="600"
                  fill="#0c2340"
                >
                  Chalakudy
                </text>

                <text
                  x="490"
                  y="195"
                  fontSize="16"
                  fontWeight="600"
                  fill="#0c2340"
                >
                  Koratty
                </text>

                <text
                  x="615"
                  y="120"
                  fontSize="16"
                  fontWeight="600"
                  fill="#0c2340"
                >
                  Ernakulam
                </text>


                {/* FISAT MARKER */}

                <circle
                  cx="300"
                  cy="220"
                  r="7"
                  fill="#ffffff"
                />

                <path
                  d="M300 195
                     C285 195 276 206 276 219
                     C276 235 300 255 300 255
                     C300 255 324 235 324 219
                     C324 206 315 195 300 195 Z"
                  fill="#0c2340"
                />

                <circle
                  cx="300"
                  cy="218"
                  r="7"
                  fill="#ffc107"
                />


                {/* BUS ICON ON ROUTE */}

                <g transform="translate(275,275)">

                  <rect
                    x="0"
                    y="0"
                    width="54"
                    height="31"
                    rx="6"
                    fill="#ffc107"
                    stroke="#0c2340"
                    strokeWidth="3"
                  />

                  <rect
                    x="7"
                    y="6"
                    width="12"
                    height="10"
                    fill="#d8eef8"
                  />

                  <rect
                    x="23"
                    y="6"
                    width="12"
                    height="10"
                    fill="#d8eef8"
                  />

                  <rect
                    x="39"
                    y="6"
                    width="8"
                    height="10"
                    fill="#d8eef8"
                  />

                  <circle
                    cx="12"
                    cy="32"
                    r="6"
                    fill="#17202a"
                  />

                  <circle
                    cx="43"
                    cy="32"
                    r="6"
                    fill="#17202a"
                  />

                </g>


                {/* MAP TITLE */}

                <rect
                  x="20"
                  y="20"
                  width="300"
                  height="48"
                  rx="8"
                  fill="#0c2340"
                  opacity="0.96"
                />

                <text
                  x="40"
                  y="51"
                  fontSize="21"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  FISAT Bus Route Network
                </text>


                {/* ROUTE LEGEND */}

                <rect
                  x="535"
                  y="25"
                  width="235"
                  height="85"
                  rx="8"
                  fill="#ffffff"
                  opacity="0.94"
                />

                <line
                  x1="555"
                  y1="50"
                  x2="590"
                  y2="50"
                  stroke="#0c2340"
                  strokeWidth="7"
                />

                <text
                  x="600"
                  y="56"
                  fontSize="14"
                  fontWeight="600"
                  fill="#0c2340"
                >
                  Main Route
                </text>

                <line
                  x1="555"
                  y1="76"
                  x2="590"
                  y2="76"
                  stroke="#ffc107"
                  strokeWidth="7"
                />

                <text
                  x="600"
                  y="82"
                  fontSize="14"
                  fontWeight="600"
                  fill="#0c2340"
                >
                  Alternative Route
                </text>

              </svg>


              <div style={styles.imageOverlay}>
                <i className="fas fa-route"></i>
                <span>Multiple Bus Routes</span>
              </div>

            </div>


            <div style={styles.cardContent}>

              <div style={styles.smallIconCircle}>
                <i
                  className="fas fa-route"
                  style={styles.darkIcon}
                ></i>
              </div>

              <h4 style={styles.cardTitle}>
                Wide Route Coverage
              </h4>

              <p style={styles.cardText}>
                Multiple transportation routes connect FISAT
                with major locations across Ernakulam and
                Thrissur, making daily commuting convenient
                for students.
              </p>

              <div style={styles.cardFooter}>

                <span>
                  <i
                    className="fas fa-map-marker-alt"
                    style={{
                      color: "#dc3545",
                      marginRight: "7px",
                    }}
                  ></i>

                  Multiple Destinations
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              CARD 3 - SMART SCHEDULING & PASSES
          ================================================= */}
          <div style={styles.busCard}>

            <div style={styles.imageContainer}>

              {/* SELF-CONTAINED BUS PASS / SCHEDULING VISUAL */}
              <svg
                viewBox="0 0 800 460"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.svgImage}
              >

                <defs>

                  <linearGradient
                    id="scheduleBg"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#dceeff"
                    />

                    <stop
                      offset="100%"
                      stopColor="#f9efd0"
                    />
                  </linearGradient>

                </defs>


                {/* BACKGROUND */}
                <rect
                  width="800"
                  height="460"
                  fill="url(#scheduleBg)"
                />


                {/* DECORATIVE CIRCLES */}
                <circle
                  cx="90"
                  cy="85"
                  r="60"
                  fill="#ffffff"
                  opacity="0.45"
                />

                <circle
                  cx="710"
                  cy="370"
                  r="80"
                  fill="#ffffff"
                  opacity="0.4"
                />


                {/* BUS */}

                <rect
                  x="70"
                  y="245"
                  width="300"
                  height="105"
                  rx="18"
                  fill="#f5b900"
                  stroke="#0c2340"
                  strokeWidth="6"
                />

                <rect
                  x="90"
                  y="215"
                  width="260"
                  height="45"
                  rx="15"
                  fill="#0c2340"
                />


                {/* BUS WINDOWS */}

                <rect
                  x="105"
                  y="225"
                  width="55"
                  height="32"
                  rx="5"
                  fill="#c6e9f8"
                />

                <rect
                  x="170"
                  y="225"
                  width="55"
                  height="32"
                  rx="5"
                  fill="#c6e9f8"
                />

                <rect
                  x="235"
                  y="225"
                  width="55"
                  height="32"
                  rx="5"
                  fill="#c6e9f8"
                />

                <rect
                  x="300"
                  y="225"
                  width="35"
                  height="32"
                  rx="5"
                  fill="#c6e9f8"
                />


                {/* BUS BODY DETAILS */}

                <rect
                  x="115"
                  y="275"
                  width="185"
                  height="35"
                  rx="5"
                  fill="#0c2340"
                />

                <text
                  x="207"
                  y="299"
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  FISAT COLLEGE BUS
                </text>


                {/* WHEELS */}

                <circle
                  cx="135"
                  cy="350"
                  r="32"
                  fill="#111827"
                />

                <circle
                  cx="135"
                  cy="350"
                  r="13"
                  fill="#9ca3af"
                />

                <circle
                  cx="300"
                  cy="350"
                  r="32"
                  fill="#111827"
                />

                <circle
                  cx="300"
                  cy="350"
                  r="13"
                  fill="#9ca3af"
                />


                {/* DIGITAL SCHEDULE PANEL */}

                <rect
                  x="415"
                  y="55"
                  width="315"
                  height="170"
                  rx="16"
                  fill="#ffffff"
                  stroke="#0c2340"
                  strokeWidth="4"
                />

                <rect
                  x="415"
                  y="55"
                  width="315"
                  height="45"
                  rx="16"
                  fill="#0c2340"
                />

                <text
                  x="440"
                  y="84"
                  fontSize="19"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  BUS SCHEDULE
                </text>


                {/* TIME */}

                <circle
                  cx="455"
                  cy="125"
                  r="15"
                  fill="#ffc107"
                />

                <text
                  x="450"
                  y="131"
                  fontSize="15"
                  fontWeight="700"
                  fill="#0c2340"
                >
                  8
                </text>

                <text
                  x="485"
                  y="131"
                  fontSize="16"
                  fill="#0c2340"
                >
                  FISAT → Angamaly
                </text>


                <line
                  x1="440"
                  y1="150"
                  x2="705"
                  y2="150"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />


                <circle
                  cx="455"
                  cy="180"
                  r="15"
                  fill="#28a745"
                />

                <text
                  x="449"
                  y="186"
                  fontSize="15"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  9
                </text>

                <text
                  x="485"
                  y="186"
                  fontSize="16"
                  fill="#0c2340"
                >
                  FISAT → Aluva
                </text>


                {/* DIGITAL BUS PASS */}

                <rect
                  x="420"
                  y="260"
                  width="300"
                  height="135"
                  rx="15"
                  fill="#0c2340"
                />

                <text
                  x="445"
                  y="290"
                  fontSize="15"
                  fontWeight="600"
                  fill="#ffc107"
                >
                  DIGITAL BUS sCHEDULING
                </text>

                <text
                  x="445"
                  y="320"
                  fontSize="22"
                  fontWeight="700"
                  fill="#ffffff"
                >
                  FISAT STUDENT
                </text>

                <text
                  x="445"
                  y="348"
                  fontSize="14"
                  fill="#dbeafe"
                >
                  Route: Angamaly - FISAT
                </text>

                {/* QR CODE STYLE */}

                <rect
                  x="635"
                  y="290"
                  width="60"
                  height="60"
                  fill="#ffffff"
                />

                <rect
                  x="642"
                  y="297"
                  width="15"
                  height="15"
                  fill="#0c2340"
                />

                <rect
                  x="673"
                  y="297"
                  width="15"
                  height="15"
                  fill="#0c2340"
                />

                <rect
                  x="642"
                  y="328"
                  width="15"
                  height="15"
                  fill="#0c2340"
                />

                <rect
                  x="673"
                  y="328"
                  width="15"
                  height="15"
                  fill="#0c2340"
                />

              </svg>


              <div style={styles.imageOverlay}>
                <i className="fas fa-ticket-alt"></i>
                <span>Smart Bus Scheduling</span>
              </div>

            </div>


            <div style={styles.cardContent}>

              <div style={styles.smallIconCircle}>
                <i
                  className="fas fa-ticket-alt"
                  style={styles.darkIcon}
                ></i>
              </div>

              <h4 style={styles.cardTitle}>
                Smart Scheduling 
              </h4>

              <p style={styles.cardText}>
                Digitized bus schedules, route information,
                seat allocation, bus pass management, and
                real-time tracking through our smart
                transportation portal.
              </p>

              <div style={styles.cardFooter}>

                <span>
                  <i
                    className="fas fa-clock"
                    style={{
                      color: "#ffc107",
                      marginRight: "7px",
                    }}
                  ></i>

                  Smart Scheduling
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SYSTEM FEATURES
      ===================================================== */}
      <section style={styles.featureSection}>

        <div style={styles.featureHeading}>

          <div style={styles.sectionLabel}>
            SMART TRANSPORTATION
          </div>

          <h3 style={styles.featureTitle}>
            Everything You Need in One Portal
          </h3>

          <p style={styles.featureSubtitle}>
            Simplifying daily transportation for students,
            staff and administrators
          </p>

        </div>


        <div style={styles.featureGrid}>

          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>
              <i className="fas fa-map-marked-alt"></i>
            </div>

            <h4>Live Bus Tracking</h4>

            <p>
              Monitor the current location of college buses
              and view route progress.
            </p>
          </div>


          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>
              <i className="fas fa-clock"></i>
            </div>

            <h4>Bus Schedules</h4>

            <p>
              Access organized bus timings and route
              schedules digitally.
            </p>
          </div>


          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>
              <i className="fas fa-chair"></i>
            </div>

            <h4>Seat Management</h4>

            <p>
              Manage seat information and provide convenient
              seat-related services.
            </p>
          </div>


          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>
              <i className="fas fa-ticket-alt"></i>
            </div>

            <h4>Seat Selection</h4>

            <p>
              Select and manage your preferred bus seats through
              the transportation portal.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          PORTAL SECTION
      ===================================================== */}
      <section style={styles.portalSection}>

        <div style={styles.portalHeading}>

          <div style={styles.sectionLabel}>
            SYSTEM ACCESS
          </div>

          <h3 style={styles.portalTitle}>
            Institutional Portal Logins
          </h3>

          <p style={styles.portalSubtitle}>
            Access dedicated transportation management systems
          </p>

        </div>


        <div style={styles.portalGrid}>

          {/* ADMIN */}
          <div
            style={{
              ...styles.portalCard,
              borderTop: "5px solid #2563eb",
            }}
          >

            <div
              style={{
                ...styles.portalIcon,
                backgroundColor: "#2563eb",
              }}
            >
              <i className="fas fa-user-shield"></i>
            </div>

            <h4 style={styles.portalCardTitle}>
              Admin Portal
            </h4>

            <p style={styles.portalCardText}>
              Manage buses, students, staff, routes,
              schedules and transportation information.
            </p>

            <a
              href="/adminlogin"
              style={{
                ...styles.portalButton,
                backgroundColor: "#2563eb",
              }}
            >
              Admin Login
            </a>

          </div>


          {/* STAFF */}
          <div
            style={{
              ...styles.portalCard,
              borderTop: "5px solid #db2777",
            }}
          >

            <div
              style={{
                ...styles.portalIcon,
                backgroundColor: "#db2777",
              }}
            >
              <i className="fas fa-chalkboard-teacher"></i>
            </div>

            <h4 style={styles.portalCardTitle}>
              Staff Portal
            </h4>

            <p style={styles.portalCardText}>
              Manage daily bus logs, schedules and
              view live bus transportation information.
            </p>

            <a
              href="/staff-login"
              style={{
                ...styles.portalButton,
                backgroundColor: "#db2777",
              }}
            >
              Staff Login
            </a>

          </div>


          {/* STUDENT */}
          <div
            style={{
              ...styles.portalCard,
              borderTop: "5px solid #ca8a04",
            }}
          >

            <div
              style={{
                ...styles.portalIcon,
                backgroundColor: "#ca8a04",
              }}
            >
              <i className="fas fa-user-graduate"></i>
            </div>

            <h4 style={styles.portalCardTitle}>
              Student Portal
            </h4>

            <p style={styles.portalCardText}>
              View bus schedules, routes, seat information,
              live bus location and transportation details.
            </p>

            <a
              href="/student-login"
              style={{
                ...styles.portalButton,
                backgroundColor: "#ca8a04",
              }}
            >
              Student Login
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT SECTION
      ===================================================== */}
      <section style={styles.contactSection}>

        <div style={styles.contactGrid}>

          <div>

            <h3 style={styles.contactTitle}>
              Contact Information
            </h3>

            <p>
              <i
                className="fas fa-map-marker-alt"
                style={styles.yellowIcon}
              ></i>

              <strong>Address:</strong> Federal Institute
              of Science and Technology (FISAT), Hormis
              Nagar, Mookkannoor P.O, Angamaly, Kerala -
              683577.
            </p>

            <p>
              <i
                className="fas fa-phone-alt"
                style={styles.yellowIcon}
              ></i>

              <strong>Phone:</strong> 0484-2725272,
              8547704139
            </p>

            <p>
              <i
                className="fas fa-envelope"
                style={styles.yellowIcon}
              ></i>

              <strong>Email:</strong> mail@fisat.ac.in
            </p>

            <p>
              <i
                className="fas fa-globe"
                style={styles.yellowIcon}
              ></i>

              <strong>Website:</strong>{" "}

              <a
                href="https://fisat.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.websiteLink}
              >
                www.fisat.ac.in
              </a>
            </p>

          </div>


          <div>

            <h3 style={styles.contactTitle}>
              Bus Management System
            </h3>

            <p>
              <i
                className="fas fa-bus"
                style={styles.yellowIcon}
              ></i>

              Smart transportation management for
              FISAT students and staff.
            </p>

            <p>
              <i
                className="fas fa-map-marked-alt"
                style={styles.yellowIcon}
              ></i>

              Live bus tracking and route monitoring.
            </p>

            <p>
              <i
                className="fas fa-ticket-alt"
                style={styles.yellowIcon}
              ></i>

              Digital bus pass and seat management.
            </p>

            <p>
              <i
                className="fas fa-clock"
                style={styles.yellowIcon}
              ></i>

              Digital bus timing and scheduling.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer style={styles.footer}>

        <div style={styles.footerContent}>

          <div>
            <i
              className="fas fa-bus"
              style={{
                color: "#ffc107",
                marginRight: "8px",
              }}
            ></i>

            FISAT Bus Management System
          </div>

          <div>
            © 2026 Federal Institute of Science and Technology
            (FISAT). All Rights Reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}


/* ============================================================
   STYLES
============================================================ */

const styles = {

  /* PAGE */

  page: {
    fontFamily:
      "'Inter', 'Segoe UI', Arial, sans-serif",
    color: "#333",
    backgroundColor: "#f4f6f9",
    margin: 0,
    padding: 0,
    lineHeight: 1.6,
    minHeight: "100vh",
  },


  /* TOP BAR */

  topBar: {
    backgroundColor: "#081b33",
    color: "#ffffff",
    padding: "8px 5%",
    fontSize: "0.82rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },

  topBarLeft: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },

  topBarRight: {
    display: "flex",
    alignItems: "center",
  },

  yellowIcon: {
    color: "#ffc107",
    marginRight: "7px",
  },


  /* HEADER */

  header: {
    backgroundColor: "#ffffff",
    boxShadow:
      "0 3px 15px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 5%",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  universityIconBox: {
    width: "62px",
    height: "62px",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  },

  headerCampusImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  universityIcon: {
    color: "#ffc107",
    fontSize: "1.65rem",
  },

  mainTitle: {
    fontSize: "1.85rem",
    color: "#0c2340",
    fontWeight: 900,
    textTransform: "uppercase",
    margin: 0,
    letterSpacing: "1px",
  },

  subtitle: {
    fontSize: "0.95rem",
    color: "#666",
    margin: "1px 0 0 0",
  },

  navList: {
    display: "flex",
    listStyle: "none",
    gap: "25px",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },

  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "0.2s",
  },


  /* HERO */

  hero: {
    position: "relative",
    minHeight: "510px",
    background:
      "linear-gradient(135deg, #0c2340 0%, #123b67 60%, #19547e 100%)",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
  },

  heroOverlay: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    border: "80px solid rgba(255,193,7,0.06)",
    right: "-180px",
    top: "-180px",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "850px",
    padding: "70px 20px",
  },

  heroBusIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#ffc107",
    color: "#0c2340",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px auto",
    fontSize: "2rem",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
  },

  heroSmallTitle: {
    color: "#ffc107",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "2px",
    margin: "0 0 12px 0",
  },

  heroTitle: {
    fontSize: "3.25rem",
    lineHeight: 1.15,
    margin: "0 0 20px 0",
    fontWeight: 800,
  },

  heroText: {
    fontSize: "1.12rem",
    maxWidth: "700px",
    margin: "0 auto 30px auto",
    color: "#e6edf5",
    fontWeight: 300,
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  heroPrimaryButton: {
    display: "inline-block",
    backgroundColor: "#ffc107",
    color: "#0c2340",
    padding: "13px 25px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 700,
  },

  heroSecondaryButton: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "#ffffff",
    padding: "11px 25px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 600,
    border: "2px solid rgba(255,255,255,0.7)",
  },


  /* COMMON */

  sectionLabel: {
    color: "#c18b00",
    fontSize: "0.78rem",
    fontWeight: 800,
    letterSpacing: "2px",
    marginBottom: "7px",
  },


  /* ABOUT */

  aboutContainer: {
    maxWidth: "1200px",
    margin: "65px auto",
    padding: "0 20px",
  },

  aboutCard: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "50px",
    alignItems: "center",
    background: "#ffffff",
    padding: "45px",
    borderRadius: "14px",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.07)",
  },

  aboutText: {
    color: "#555",
  },

  sectionTitle: {
    fontSize: "2rem",
    color: "#0c2340",
    margin:
      "0 0 18px 0",
    fontWeight: 750,
  },

  aboutVisual: {
    width: "100%",
  },

  campusImageWrapper: {
    position: "relative",
    width: "100%",
    height: "340px",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: "#e8eef3",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },

  campusImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  campusImageLabel: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80%",
    textAlign: "center",
    backgroundColor: "rgba(12,35,64,0.92)",
    color: "#ffffff",
    padding: "9px",
    borderRadius: "5px",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },

  campusIllustration: {
    position: "relative",
    height: "340px",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: "#dff2ff",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.1)",
  },

  campusSky: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(#a9dcf8 0%, #e7f6ff 65%)",
  },

  campusBuilding: {
    position: "absolute",
    left: "13%",
    right: "13%",
    bottom: "75px",
    height: "180px",
    background:
      "linear-gradient(135deg,#ffffff,#dbe4ec)",
    borderRadius: "5px",
    border:
      "4px solid #0c2340",
    boxShadow:
      "0 10px 20px rgba(0,0,0,0.15)",
  },

  buildingTop: {
    position: "absolute",
    top: "-28px",
    left: "8%",
    width: "84%",
    height: "35px",
    backgroundColor: "#c8d3dc",
    transform: "skewX(-18deg)",
    border:
      "3px solid #0c2340",
  },

  buildingWindowRow: {
    display: "flex",
    gap: "14px",
    margin:
      "25px 20px 0 20px",
  },

  buildingEntrance: {
    position: "absolute",
    bottom: 0,
    left: "44%",
    width: "55px",
    height: "75px",
    backgroundColor: "#0c2340",
    color: "#ffc107",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
  },

  campusGround: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80px",
    background:
      "linear-gradient(#76a85c,#47783e)",
  },

  campusLabel: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform:
      "translateX(-50%)",
    width: "80%",
    textAlign: "center",
    backgroundColor:
      "rgba(12,35,64,0.92)",
    color: "#ffffff",
    padding: "9px",
    borderRadius: "5px",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },

  readMoreButton: {
    display: "inline-block",
    backgroundColor: "#0c2340",
    color: "#ffffff",
    padding: "11px 22px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    marginTop: "10px",
  },


  /* BUS SECTION */

  busSection: {
    maxWidth: "1200px",
    margin: "75px auto",
    padding: "0 20px",
  },

  busHeading: {
    textAlign: "center",
    marginBottom: "40px",
  },

  busIconCircle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    backgroundColor: "#0c2340",
    marginBottom: "15px",
  },

  busHeadingIcon: {
    color: "#ffc107",
    fontSize: "1.55rem",
  },

  busSectionTitle: {
    fontSize: "2.3rem",
    color: "#0c2340",
    margin: "0 0 8px 0",
    fontWeight: 750,
  },

  busSectionSubtitle: {
    color: "#68727c",
    margin: 0,
    fontSize: "1rem",
  },

  busGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "24px",
  },


  /* BUS CARDS */

  busCard: {
    background: "#ffffff",
    borderRadius: "13px",
    overflow: "hidden",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.08)",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    height: "245px",
    overflow: "hidden",
    backgroundColor: "#e8eef3",
  },

  svgImage: {
    width: "100%",
    height: "100%",
    display: "block",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background:
      "linear-gradient(transparent, rgba(0,0,0,0.82))",
    color: "#ffffff",
    padding:
      "45px 20px 16px 20px",
    fontSize: "0.95rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  cardContent: {
    padding: "25px",
  },

  smallIconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#eef3f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    fontSize: "1.05rem",
  },

  darkIcon: {
    color: "#0c2340",
  },

  cardTitle: {
    color: "#0c2340",
    margin: "0 0 10px 0",
    fontSize: "1.28rem",
    fontWeight: 750,
  },

  cardText: {
    color: "#66717c",
    fontSize: "0.91rem",
    margin: "0 0 18px 0",
    lineHeight: 1.65,
  },

  cardFooter: {
    borderTop:
      "1px solid #e7ebef",
    paddingTop: "14px",
    color: "#4f5963",
    fontSize: "0.85rem",
  },


  /* FEATURE SECTION */

  featureSection: {
    backgroundColor: "#eef2f6",
    padding:
      "70px 20px",
    borderTop:
      "1px solid #e1e6eb",
    borderBottom:
      "1px solid #e1e6eb",
  },

  featureHeading: {
    textAlign: "center",
    maxWidth: "700px",
    margin:
      "0 auto 40px auto",
  },

  featureTitle: {
    fontSize: "2.15rem",
    color: "#0c2340",
    margin:
      "0 0 8px 0",
  },

  featureSubtitle: {
    color: "#66717c",
    margin: 0,
  },

  featureGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "22px",
  },

  featureItem: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "30px 22px",
    textAlign: "center",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.05)",
  },

  featureIcon: {
    width: "55px",
    height: "55px",
    margin:
      "0 auto 15px auto",
    borderRadius: "50%",
    backgroundColor: "#0c2340",
    color: "#ffc107",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
  },

  featureItemTitle: {
    color: "#0c2340",
  },


  /* PORTALS */

  portalSection: {
    backgroundColor: "#ffffff",
    padding:
      "70px 20px",
    borderTop:
      "3px solid #ffc107",
  },

  portalHeading: {
    textAlign: "center",
    marginBottom: "38px",
  },

  portalTitle: {
    fontSize: "2.25rem",
    color: "#0c2340",
    margin: 0,
    fontWeight: 750,
  },

  portalSubtitle: {
    color: "#66717c",
    margin:
      "8px 0 0 0",
  },

  portalGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "28px",
  },

  portalCard: {
    background:
      "linear-gradient(135deg,#ffffff,#f7f9fc)",
    borderRadius: "12px",
    padding: "35px 28px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.07)",
  },

  portalIcon: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin:
      "0 auto 18px auto",
    color: "#ffffff",
    fontSize: "1.7rem",
  },

  portalCardTitle: {
    color: "#0c2340",
    margin:
      "0 0 10px 0",
    fontSize: "1.35rem",
  },

  portalCardText: {
    color: "#5f6974",
    fontSize: "0.92rem",
    marginBottom: "23px",
    minHeight: "70px",
  },

  portalButton: {
    display: "inline-block",
    color: "#ffffff",
    padding: "11px 25px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 650,
    fontSize: "0.9rem",
  },


  /* CONTACT */

  contactSection: {
    backgroundColor: "#0c2340",
    color: "#f8f9fa",
    padding:
      "60px 20px",
  },

  contactGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "55px",
  },

  contactTitle: {
    fontSize: "1.55rem",
    marginBottom: "20px",
    color: "#ffc107",
  },

  websiteLink: {
    color: "#ffffff",
    textDecoration: "none",
  },


  /* FOOTER */

  footer: {
    backgroundColor: "#07182c",
    color: "#aeb7c2",
    padding: "20px",
    fontSize: "0.82rem",
  },

  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

};