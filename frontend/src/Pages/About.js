
import GuitarTriviaQuiz from '../components/GuitarTriviaQuiz'; 

const About = () => {
    return (
        <div className="about-page">
            <header className="header">
                <span className="eyebrow">The Story</span>
                <h1>MY JOURNEY</h1>
            </header>

            <div className="content">
                <div className="highlight-grid">
                    <div className="card">
                        <h2>The Passion Behind the Strings</h2>
                        <p>
                            My fascination began with the soulful blues of B.B. King. 
                            To me, the guitar is a tool for storytelling. Every calloused 
                            fingertip represents hours of moving from simple chords to 
                            complex patterns.
                        </p>

                        <blockquote className="modern-quote">
                            "Music is the mediator between the spiritual and the sensual life."
                            <cite>— Ludwig van Beethoven</cite>
                        </blockquote>
                    </div>

                    <div className="card">
                        <h3>Learning Timeline</h3>
                        <ol className="modern-timeline">
                            <li><span>2015</span> Began studying and memorizing all basic open and barre chords.</li>
                            <li><span>2016</span> Mastered the structures and fingerings for the Major scales.</li>
                            <li><span>2024</span> Started recording and posting guitar covers online to share my music.</li>
                        </ol>
                    </div>
                </div>

               
                <section className="hero" style={{ marginTop: '40px' }}>
                    <h3>My Gear Gallery</h3>
                    <div className="gallery-container">
                        <div className="gallery-item">
                         
                            <img src="/assets/Guitar1.jpg" alt="Acoustic Guitar" />
                            <p>Acoustic Classic</p>
                        </div>
                        <div className="gallery-item">
                            <img src="/assets/Guitar2.jpg" alt="Electric Stratocaster" />
                            <p>Electric Stratocaster</p>
                        </div>
                    </div>
                </section>
                <GuitarTriviaQuiz />
                
            </div>
        </div>
    );
};

export default About;