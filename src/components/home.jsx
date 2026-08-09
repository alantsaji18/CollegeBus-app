import React from 'react';

export default function Home() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#333', backgroundColor: '#f4f6f9', margin: 0, padding: 0, lineHeight: 1.6 }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#0c2340', color: '#f8f9fa', padding: '8px 5%', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span><i className="fas fa-phone-alt" style={{ color: '#ffc107', marginRight: '5px' }}></i> 0484-2725272, 8547704139</span>
          <span style={{ marginLeft: '20px' }}><i className="fas fa-envelope" style={{ color: '#ffc107', marginRight: '5px' }}></i> mail@fisat.ac.in</span>
        </div>
        <div>
          <span><i className="fas fa-map-marker-alt" style={{ color: '#ffc107', marginRight: '5px' }}></i> Hormis Nagar, Mookkannoor P.O, Angamaly, Kerala - 683577</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header style={{ background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fas fa-university fa-2x" style={{ color: '#0c2340' }}></i>
          <div>
            <h1 style={{ fontSize: '2.05rem', color: '#0c2340', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>FISAT BUS MANAGEMENT SYSTEM</h1>
            <p style={{ fontSize: '1.1rem', color: '#666', letterSpacing: '0.5px', margin: 0 }}>Federal Institute of Science and Technology</p>
          </div>
        </div>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><a href="https://fisat.ac.in/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333333', fontWeight: 500, fontSize: '0.95rem' }}>About</a></li>
            <li><a href="https://fisat.ac.in/campus-life/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333333', fontWeight: 500, fontSize: '0.95rem' }}>Campus</a></li>
            <li><a href="https://fisat.ac.in/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333333', fontWeight: 500, fontSize: '0.95rem' }}>Portals</a></li>
            <li><a href="https://fisat.ac.in/contact-us/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333333', fontWeight: 500, fontSize: '0.95rem' }}>Contact Us</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(rgba(12, 35, 64, 0.85), rgba(12, 35, 64, 0.85)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80") no-repeat center center/cover', color: '#f8f9fa', textAlign: 'center', padding: '120px 20px' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontWeight: 700 }}>Welcome to FISAT</h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto 30px auto', fontWeight: 300 }}>Federal Institute of Science and Technology (FISAT) is established and run by the Federal Bank Officers' Association Educational Society (FBOAES). Dedicated to excellence in professional education.</p>
        <a href="https://fisat.ac.in/about-fisat/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', backgroundColor: '#ffc107', color: '#0c2340', padding: '12px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}>Explore Institution</a>
      </section>

      {/* About Section */}
      <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', background: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div>
            <h3 style={{ fontSize: '2rem', color: '#0c2340', marginBottom: '20px' }}>About Our Institution</h3>
            <p style={{ marginBottom: '15px', color: '#555', fontSize: '1rem' }}><strong>Federal Institute of Science and Technology (FISAT)</strong> is a premier professional institution located in Hormis Nagar, Mookkannoor, near Angamaly in the Ernakulam district of Kerala. Established in 2002, the college has quickly evolved into a leading center for technical education.</p>
            <p style={{ marginBottom: '15px', color: '#555', fontSize: '1rem' }}>Managed by the Federal Bank Officers’ Association Educational Society (FBOAES), FISAT is affiliated with A P J Abdul Kalam Technological University (KTU) and approved by AICTE. Set in a sprawling 40-acre rustic and eco-friendly campus, the institution provides world-class undergraduate, postgraduate, and doctoral programs focused heavily on innovation, values, and strong industry linkages.</p>
            <a href="https://fisat.ac.in/about-fisat/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', backgroundColor: '#0c2340', color: 'white', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', marginTop: '10px' }}>Read More on Official Page <i className="fas fa-external-link-alt"></i></a>
          </div>
          <div>
            <img src="https://image-static.collegedunia.com/public/college_data/images/appImage/13462_FISAT_NEW.jpg" alt="FISAT Campus Infrastructure" style={{ width: '100%', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </div>

      {/* Bus Fleet & Transportation Network */}
      <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '2.2rem', color: '#0c2340', margin: 0 }}>Bus Fleet & Transportation Network</h3>
          <p style={{ color: '#666', margin: '10px 0 0 0' }}>Safe, reliable, and well-connected transit solutions across multiple routes for students and staff</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80" alt="College Bus Fleet" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#0c2340', marginBottom: '10px', fontSize: '1.2rem' }}>Comfortable Fleet</h4>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>A dedicated fleet of well-maintained buses ensuring safe and comfortable daily commutes from major hubs.</p>
            </div>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80" alt="Extensive Route Coverage" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#0c2340', marginBottom: '10px', fontSize: '1.2rem' }}>Wide Route Coverage</h4>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Extensive connectivity covering Ernakulam, Aluva, Angamaly, Chalakudy, Perumbavoor, and surrounding areas.</p>
            </div>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <img src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80" alt="Live Bus Scheduling" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#0c2340', marginBottom: '10px', fontSize: '1.2rem' }}>Smart Scheduling & Passes</h4>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Digitized seat allocation, seamless bus pass generation, and real-time schedule tracking through our portal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Portal Logins */}
      <div style={{ backgroundColor: '#ffffff', padding: '60px 20px', marginTop: '50px', borderTop: '3px solid #ffc107' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '2.2rem', color: '#0c2340', margin: 0 }}>Institutional Portal Logins</h3>
          <p style={{ color: '#666', margin: '10px 0 0 0' }}>Access dedicated institutional management systems and dashboards</p>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Admin Portal Card */}
          <div style={{ background: 'linear-gradient(135deg, #ffffff 0% , #f0f4ff 100%)', border: '2px solid #3b82f6', padding: '35px 30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)', transition: 'transform 0.3s ease' }}>
            <div style={{ width: '70px', height: '70px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 6px 15px rgba(59, 130, 246, 0.4)' }}>
              <i className="fas fa-user-shield" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
            </div>
            <h4 style={{ color: '#0c2340', marginBottom: '12px', fontSize: '1.4rem', fontWeight: 700 }}>Admin Portal</h4>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '25px', lineHeight: 1.5 }}>Manage institution-wide settings, user credentials, department registries, and official system logs.</p>
            <a href="/admin-login" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>Admin Login</a>
          </div>

          {/* Staff Portal Card */}
          <div style={{ background: 'linear-gradient(135deg, #ffffff 0% , #fdf4ff 100%)', border: '2px solid #ec4899', padding: '35px 30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.15)', transition: 'transform 0.3s ease' }}>
            <div style={{ width: '70px', height: '70px', background: '#ec4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 6px 15px rgba(236, 72, 153, 0.4)' }}>
              <i className="fas fa-chalkboard-teacher" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
            </div>
            <h4 style={{ color: '#0c2340', marginBottom: '12px', fontSize: '1.4rem', fontWeight: 700 }}>Staff Portal</h4>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '25px', lineHeight: 1.5 }}>Access faculty workloads, internal evaluation records, attendance loggers, and departmental announcements.</p>
            <a href="/staff-login" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)', color: 'white', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)' }}>Staff Login</a>
          </div>

          {/* Student Portal Card */}
          <div style={{ background: 'linear-gradient(135deg, #ffffff 0% , #fefce8 100%)', border: '2px solid #eab308', padding: '35px 30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 25px rgba(234, 179, 8, 0.15)', transition: 'transform 0.3s ease' }}>
            <div style={{ width: '70px', height: '70px', background: '#eab308', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 6px 15px rgba(234, 179, 8, 0.4)' }}>
              <i className="fas fa-user-graduate" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
            </div>
            <h4 style={{ color: '#0c2340', marginBottom: '12px', fontSize: '1.4rem', fontWeight: 700 }}>Student Portal</h4>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '25px', lineHeight: 1.5 }}>Track academic performance, internal marks, fee transactions, timetable layouts, and library records.</p>
            <a href="/student-login" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)', color: 'white', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(202, 138, 4, 0.3)' }}>Student Login</a>
          </div>

        </div>
      </div>

      {/* Contact Section */}
      <section style={{ backgroundColor: '#0c2340', color: '#f8f9fa', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#ffc107' }}>Contact Information</h3>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-map-marker-alt" style={{ color: '#ffc107', marginTop: '5px' }}></i> <strong>Address:</strong> Federal Institute of Science and Technology (FISAT)®, Hormis Nagar, Mookkannoor P.O, Angamaly, Ernakulam Dt., Kerala, India, Pin - 683 577.</p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-phone-alt" style={{ color: '#ffc107', marginTop: '5px' }}></i> <strong>Phone:</strong> 0484-2725272, 8547704139, 9495737577</p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-envelope" style={{ color: '#ffc107', marginTop: '5px' }}></i> <strong>Email:</strong> mail@fisat.ac.in</p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-globe" style={{ color: '#ffc107', marginTop: '5px' }}></i> <strong>Website:</strong> www.fisat.ac.in</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#ffc107' }}>Management Society</h3>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-building" style={{ color: '#ffc107', marginTop: '5px' }}></i> <strong>Federal Bank Officers Association Educational Society (FBOAES)</strong></p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-map-pin" style={{ color: '#ffc107', marginTop: '5px' }}></i> FBOA Centre, FBOA Road, Aluva, Kerala.</p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-phone" style={{ color: '#ffc107', marginTop: '5px' }}></i> <strong>Office Phone:</strong> 0484 – 2628646 / 2627646</p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem' }}><i className="fas fa-info-circle" style={{ color: '#ffc107', marginTop: '5px' }}></i> Managed by a team of visionaries aiming to translate high-end technical training into professional outcomes.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#08172b', color: '#aaa', textAlign: 'center', padding: '20px', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ margin: 0 }}>&copy; 2026 Federal Institute of Science and Technology (FISAT). All Rights Reserved.</p>
      </footer>
    </div>
  );
}