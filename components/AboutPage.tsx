import React from 'react';

// SVG Icons (can be moved to a separate file if used elsewhere)
const TwitterIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 3.232-.044h.001zm-1.043 1.116A4.108 4.108 0 0 0 4.108 8a4.108 4.108 0 0 0 4.109 4.109A4.108 4.108 0 0 0 12.325 8a4.108 4.108 0 0 0-4.11-4.109zm0 1.291A2.817 2.817 0 0 1 11.02 8a2.817 2.817 0 0 1-2.816 2.817A2.817 2.817 0 0 1 5.387 8a2.817 2.817 0 0 1 2.816-2.817zM12.5 3.163a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92z"/>
  </svg>
);


const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl bg-white shadow-xl rounded-xl my-8">
      <h2 className="text-3xl font-bold text-center text-[#368282] mb-8">About Free The Bladder</h2>
      
      <div className="prose prose-lg sm:prose-xl max-w-none text-slate-700 leading-relaxed">
        <p className="text-lg sm:text-xl">
          Free The Bladder is a community-powered app that helps you find and share access to toilets in cities — no awkward purchases, no locked doors, no gatekeeping. We’re here to make relief accessible.
        </p>
        <p className="mt-6 text-lg sm:text-xl font-semibold italic text-slate-800">
          Every code shared is an act of everyday solidarity.
        </p>
        <p className="mt-6 text-2xl sm:text-3xl text-center font-bold text-[#368282] py-4">
          🚽 Add a loo, free a bladder.
        </p>
        <p className="mt-6 text-lg sm:text-xl">
          Submit a toilet code, and help someone find relief — no questions asked.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <h3 className="text-2xl font-semibold text-center text-[#368282] mb-6">Connect with Us</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <a
            href="https://twitter.com/yourprofile" // Replace with your actual Twitter URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#1DA1F2] hover:bg-[#0c85d0] transition-colors duration-150 shadow-md hover:shadow-lg w-full sm:w-auto"
            aria-label="Follow us on Twitter"
          >
            <TwitterIcon className="h-6 w-6 mr-2" />
            Twitter
          </a>
          <a
            href="https://instagram.com/yourprofile" // Replace with your actual Instagram URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-opacity duration-150 shadow-md hover:shadow-lg w-full sm:w-auto"
            aria-label="Follow us on Instagram"
          >
            <InstagramIcon className="h-6 w-6 mr-2" />
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
