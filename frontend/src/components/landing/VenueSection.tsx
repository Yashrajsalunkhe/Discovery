export const VenueSection = () => {
  return (
    <section className="section bg-[#F6F8F5] border-b border-[#E6E6E6]" id="venue">
      <div className="wrap">
        
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide w-fit mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7B9669]" />
          <span>VENUE & CAMPUS GUIDE</span>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="section-title text-[#404E3B]">Getting to ADCET Campus</h2>
            <p className="text-[#2E382A] text-base max-w-[560px] mt-2">
              Annasaheb Dange College of Engineering and Technology, Ashta, Sangli — easily accessible by road and rail.
            </p>
          </div>
        </div>

        {/* Venue Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Location Card (8 cols) */}
          <div className="lg:col-span-8 jade-card p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#7B9669] bg-[#F1F5EE] border border-[#BAC8B1] px-3 py-1 rounded-full">
                  📍 CAMPUS HEADQUARTERS
                </span>
                <span className="font-mono text-xs text-[#6C8480]">
                  16.95° N, 74.40° E
                </span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#404E3B] mb-2">
                ADCET Campus, Ashta
              </h3>
              <p className="text-[#2E382A] text-base leading-relaxed mb-6">
                Ashta-Nanded Road, Taluka Walwa, District Sangli, Maharashtra — 416301. All competition tracks, lab stations, auditoriums, and food courts are located within the main engineering complex.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6E6E6]">
                <div className="p-4 rounded-xl bg-[#F9FBF8] border border-[#BAC8B1]">
                  <div className="font-mono text-xs text-[#6C8480] font-bold">BY BUS</div>
                  <div className="font-bold text-[#404E3B] text-sm mt-0.5">Ashta Bus Stand</div>
                  <div className="text-xs text-[#6C8480] mt-0.5">2 km from Campus</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F9FBF8] border border-[#BAC8B1]">
                  <div className="font-mono text-xs text-[#6C8480] font-bold">BY TRAIN</div>
                  <div className="font-bold text-[#404E3B] text-sm mt-0.5">Sangli / Miraj Station</div>
                  <div className="text-xs text-[#6C8480] mt-0.5">25 km from Campus</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F9FBF8] border border-[#BAC8B1]">
                  <div className="font-mono text-xs text-[#6C8480] font-bold">BY AIR</div>
                  <div className="font-bold text-[#404E3B] text-sm mt-0.5">Kolhapur Airport</div>
                  <div className="text-xs text-[#6C8480] mt-0.5">45 km from Campus</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6E6E6] flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-xs font-semibold text-[#6C8480]">
                Helpdesk: +91 2342 220555 • discovery@adcet.ac.in
              </span>
              <a
                href="https://maps.google.com/?q=ADCET+Ashta"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-jade-primary text-xs py-2.5 px-5"
              >
                Open Google Maps ↗
              </a>
            </div>
          </div>

          {/* Quick Help Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="jade-card p-6 sm:p-8 bg-[#F1F5EE] border-[#BAC8B1] space-y-4">
              <span className="font-mono text-xs font-bold text-[#7B9669] bg-[#FFFFFF] border border-[#BAC8B1] px-3 py-1 rounded-full">
                💡 ACCOMMODATION & HELP
              </span>
              <h4 className="font-display font-extrabold text-xl text-[#404E3B]">
                Traveling From Outside Sangli?
              </h4>
              <p className="text-[#2E382A] text-sm leading-relaxed">
                Outstation teams can request campus assistance for local transport and hostel rest rooms upon early registration.
              </p>
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#BAC8B1] space-y-2 text-xs font-mono text-[#404E3B]">
                <div className="flex justify-between border-b border-[#E6E6E6] pb-1">
                  <span>Student Helpdesk:</span>
                  <span className="font-bold">+91 98765 43210</span>
                </div>
                <div className="flex justify-between">
                  <span>Faculty Desk:</span>
                  <span className="font-bold">+91 91234 56789</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
