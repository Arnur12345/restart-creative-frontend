import React from 'react';
import { Link } from 'react-router-dom';
import landing from '../assets/landing.png';
import logo from '../assets/logo.png'

const LandingPage = () => {
    return (
        <div className="bg-[#f7f9fb] min-h-screen">
            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto py-10 md:py-16 px-2 sm:px-4 md:px-8">
                <div className="w-full md:w-1/2 z-10 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
                        Креативті видеолар платформасы
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
                        Restart Creative — шығармашыл адамдарға арналған, апталық тақырыптар мен бейнелерді бөлісуге мүмкіндік беретін платформа.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/theme-weeks" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-primary-700 transition-colors w-full sm:w-auto text-center">
                            Апталарды көру
                        </Link>
                        <Link to="/admin" className="bg-white border border-primary-600 text-primary-700 px-6 py-3 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-primary-50 transition-colors w-full sm:w-auto text-center">
                            Админге кіру
                        </Link>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0 relative">
                    <img src={landing} alt="Creativity" className="w-64 sm:w-80 md:w-[360px] rounded-2xl shadow-2xl border-4 border-white" />
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto py-10 md:py-16 px-2 sm:px-4 md:px-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">Платформаның мүмкіндіктері</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
                        <div className="bg-primary-100 rounded-full p-3 md:p-4 mb-4">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 3v18m9-9H3" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Тақырыптық апталар</h3>
                        <p className="text-gray-600 text-sm md:text-base">Әр апта жаңа тақырып, жаңа шабыт! Өз бейнеңізді қосып, шығармашылығыңызды көрсетіңіз.</p>
                    </div>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
                        <div className="bg-primary-100 rounded-full p-3 md:p-4 mb-4">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Голос беру</h3>
                        <p className="text-gray-600 text-sm md:text-base">Ұнаған видеоларға дауыс беріп, үздіктерді анықтаңыз.</p>
                    </div>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
                        <div className="bg-primary-100 rounded-full p-3 md:p-4 mb-4">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Қауымдастық</h3>
                        <p className="text-gray-600 text-sm md:text-base">Шығармашыл адамдармен танысып, тәжірибе алмасыңыз.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-primary-600 py-10 md:py-16 px-2 sm:px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Restart Creative — шығармашылыққа жаңа серпін бер!</h2>
                    <p className="text-base md:text-lg text-primary-100 mb-8">Бүгін тіркеліп, өз бейнеңізді қосыңыз!</p>
                    <Link to="/theme-weeks" className="bg-white text-primary-700 px-6 md:px-8 py-3 rounded-lg font-semibold text-base md:text-lg shadow hover:bg-primary-50 transition-colors">
                        Апталарды көру
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-6 md:py-8 border-t mt-8 md:mt-10">
                <div className="max-w-6xl mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <img src={logo} alt="Logo" className="h-8" />
                        <span className="font-bold text-gray-700">Restart Creative</span>
                    </div>
                    <div className="text-gray-400 text-xs md:text-sm text-center md:text-right">© {new Date().getFullYear()} Restart Creative. Барлық құқықтар қорғалған.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
