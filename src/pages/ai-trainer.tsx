import { NextPage } from "next";
import NextImage from "next/legacy/image";
import {
  BookOpen,
  Brain,
  Code,
  GitBranch,
  Layers,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "react-feather";
import tw, { styled } from "twin.macro";
import { Link } from "../components/Link";

const Container = styled.div`
  ${tw`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
`;

const Section = styled.section`
  ${tw`py-16 px-6 md:px-12 lg:px-24`}
`;

const HeroSection = styled(Section)`
  ${tw`pt-24 pb-32 text-center relative overflow-hidden`}
`;

const Heading = styled.h1`
  ${tw`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent`}
`;

const SubHeading = styled.h2`
  ${tw`text-3xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100`}
`;

const Description = styled.p`
  ${tw`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto`}
`;

const CTAButton = styled.a`
  ${tw`inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
`;

const SecondaryButton = styled.a`
  ${tw`inline-block px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-600 dark:border-purple-400 ml-4 cursor-pointer`}
`;

const Grid = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto`}
`;

const Card = styled.div`
  ${tw`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
`;

const IconWrapper = styled.div`
  ${tw`w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6`}
`;

const CardTitle = styled.h3`
  ${tw`text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100`}
`;

const CardText = styled.p`
  ${tw`text-gray-600 dark:text-gray-300 leading-relaxed`}
`;

const StatsSection = styled(Section)`
  ${tw`bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white`}
`;

const StatGrid = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center`}
`;

const StatNumber = styled.div`
  ${tw`text-5xl font-bold mb-2`}
`;

const StatLabel = styled.div`
  ${tw`text-xl opacity-90`}
`;

const TestimonialSection = styled(Section)`
  ${tw`bg-gray-100 dark:bg-gray-900`}
`;

const TestimonialCard = styled.div`
  ${tw`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-4xl mx-auto`}
`;

const Quote = styled.p`
  ${tw`text-xl italic text-gray-700 dark:text-gray-300 mb-4`}
`;

const Author = styled.p`
  ${tw`text-lg font-semibold text-purple-600 dark:text-purple-400`}
`;

const AITrainerLanding: NextPage = () => {
  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <div tw="absolute inset-0 opacity-10">
          <div tw="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl" />
          <div tw="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl" />
          <div tw="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl" />
        </div>

        <div tw="relative z-10">
          <Heading>Formatore AI Professionista</Heading>
          <Description>
            Trasforma il tuo team con la potenza dell'Intelligenza Artificiale.
            Formazione personalizzata, consulenza strategica e implementazione pratica.
          </Description>
          <div tw="flex flex-col sm:flex-row justify-center items-center gap-4">
            <CTAButton href="#contatti">Inizia Ora</CTAButton>
            <SecondaryButton href="#servizi">Scopri i Servizi</SecondaryButton>
          </div>
        </div>
      </HeroSection>

      {/* Services Section */}
      <Section id="servizi">
        <div tw="text-center mb-16">
          <SubHeading>Servizi Offerti</SubHeading>
          <Description tw="mb-0">
            Soluzioni complete per integrare l'AI nella tua organizzazione
          </Description>
        </div>

        <Grid>
          <Card>
            <IconWrapper>
              <Brain size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Formazione AI Personalizzata</CardTitle>
            <CardText>
              Corsi su misura per il tuo team: Machine Learning, Deep Learning,
              LLM e AI Generativa. Teoria e pratica per risultati concreti.
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <Target size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Consulenza Strategica</CardTitle>
            <CardText>
              Identifica le opportunità di AI nel tuo business. Sviluppa una
              roadmap personalizzata e massimizza il ROI dei tuoi progetti AI.
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <Code size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Workshop Pratici</CardTitle>
            <CardText>
              Sessioni hands-on con TensorFlow, PyTorch, OpenAI, LangChain e altri
              framework. Impara facendo con progetti reali.
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <Users size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Team Building AI</CardTitle>
            <CardText>
              Costruisci competenze AI nel tuo team. Formazione per sviluppatori,
              data scientists, product managers e decision makers.
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <GitBranch size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>MLOps e Deployment</CardTitle>
            <CardText>
              Impara a portare modelli AI in produzione. Best practices per
              versioning, monitoring, scaling e manutenzione.
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <Zap size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>AI Automation</CardTitle>
            <CardText>
              Automatizza processi aziendali con AI. Dall'elaborazione documenti
              alla customer service automation con chatbot intelligenti.
            </CardText>
          </Card>
        </Grid>
      </Section>

      {/* Stats Section */}
      <StatsSection>
        <StatGrid>
          <div>
            <StatNumber>500+</StatNumber>
            <StatLabel>Professionisti Formati</StatLabel>
          </div>
          <div>
            <StatNumber>100+</StatNumber>
            <StatLabel>Aziende Clienti</StatLabel>
          </div>
          <div>
            <StatNumber>50+</StatNumber>
            <StatLabel>Workshop Tenuti</StatLabel>
          </div>
          <div>
            <StatNumber>98%</StatNumber>
            <StatLabel>Soddisfazione Cliente</StatLabel>
          </div>
        </StatGrid>
      </StatsSection>

      {/* Expertise Section */}
      <Section>
        <div tw="text-center mb-16">
          <SubHeading>Aree di Competenza</SubHeading>
        </div>

        <Grid tw="lg:grid-cols-2">
          <Card>
            <IconWrapper>
              <BookOpen size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Machine Learning & Deep Learning</CardTitle>
            <CardText>
              <ul tw="list-disc list-inside space-y-2 mt-4">
                <li>Algoritmi di classificazione e regressione</li>
                <li>Reti neurali e architetture avanzate (CNN, RNN, Transformers)</li>
                <li>Computer Vision e Natural Language Processing</li>
                <li>Transfer Learning e Fine-tuning</li>
              </ul>
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <MessageCircle size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Large Language Models & AI Generativa</CardTitle>
            <CardText>
              <ul tw="list-disc list-inside space-y-2 mt-4">
                <li>GPT, Claude, Gemini e altri LLM</li>
                <li>Prompt Engineering avanzato</li>
                <li>RAG (Retrieval Augmented Generation)</li>
                <li>Sviluppo di applicazioni con LangChain e LlamaIndex</li>
              </ul>
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <Layers size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>Data Science & Analytics</CardTitle>
            <CardText>
              <ul tw="list-disc list-inside space-y-2 mt-4">
                <li>Analisi esplorativa e visualizzazione dati</li>
                <li>Feature Engineering e preparazione dati</li>
                <li>Modelli predittivi e forecasting</li>
                <li>A/B Testing e sperimentazione</li>
              </ul>
            </CardText>
          </Card>

          <Card>
            <IconWrapper>
              <TrendingUp size={32} tw="text-white" />
            </IconWrapper>
            <CardTitle>AI Strategy & Business Impact</CardTitle>
            <CardText>
              <ul tw="list-disc list-inside space-y-2 mt-4">
                <li>Valutazione opportunità AI nel business</li>
                <li>Calcolo ROI e KPI per progetti AI</li>
                <li>Etica e governance dell'AI</li>
                <li>Change management e adozione AI</li>
              </ul>
            </CardText>
          </Card>
        </Grid>
      </Section>

      {/* Testimonial Section */}
      <TestimonialSection>
        <div tw="text-center mb-16">
          <SubHeading>Cosa Dicono i Clienti</SubHeading>
        </div>

        <div tw="space-y-8">
          <TestimonialCard>
            <Quote>
              "La formazione AI ricevuta ha trasformato completamente il nostro approccio
              allo sviluppo prodotto. In 3 mesi abbiamo implementato soluzioni che hanno
              aumentato l'efficienza del 40%. Competenza tecnica e capacità didattica eccezionali."
            </Quote>
            <Author>— Marco Rossi, CTO TechInnovate</Author>
          </TestimonialCard>

          <TestimonialCard>
            <Quote>
              "Workshop pratico e coinvolgente. Ho acquisito competenze immediatamente
              applicabili. Il formatore ha saputo rendere accessibili anche i concetti
              più complessi di Machine Learning. Altamente raccomandato!"
            </Quote>
            <Author>— Laura Bianchi, Data Scientist Lead</Author>
          </TestimonialCard>

          <TestimonialCard>
            <Quote>
              "Consulenza strategica di altissimo livello. Ci ha aiutato a identificare
              i casi d'uso AI più promettenti e a costruire una roadmap realistica.
              I risultati parlano da soli: 3 progetti in produzione e ROI positivo in 6 mesi."
            </Quote>
            <Author>— Giovanni Verdi, Innovation Manager RetailPlus</Author>
          </TestimonialCard>
        </div>
      </TestimonialSection>

      {/* CTA Section */}
      <Section id="contatti">
        <div tw="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-12 shadow-2xl">
          <SubHeading tw="text-white mb-6">
            Pronto a Trasformare il Tuo Business con l'AI?
          </SubHeading>
          <Description tw="text-white mb-8">
            Prenota una consulenza gratuita di 30 minuti per discutere
            le tue esigenze e scoprire come l'AI può aiutarti a raggiungere i tuoi obiettivi.
          </Description>
          <div tw="flex flex-col sm:flex-row justify-center items-center gap-4">
            <CTAButton
              tw="bg-white text-purple-600 hover:bg-gray-100"
              href="mailto:formatore@ai-training.com"
            >
              Contattami Ora
            </CTAButton>
            <SecondaryButton
              tw="bg-transparent border-white text-white hover:bg-white/10"
              href="https://calendly.com/ai-trainer"
            >
              Prenota una Call
            </SecondaryButton>
          </div>

          <div tw="mt-12 pt-8 border-t border-white/30 text-white/90">
            <p tw="text-lg mb-4">Informazioni di Contatto</p>
            <div tw="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
              <span>📧 formatore@ai-training.com</span>
              <span>📱 +39 123 456 7890</span>
              <span>💼 LinkedIn: /in/ai-trainer</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer tw="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>© 2024 AI Training Professional. Tutti i diritti riservati.</p>
        <p tw="mt-2 text-sm">
          Formazione AI • Consulenza Strategica • Workshop Pratici
        </p>
      </footer>
    </Container>
  );
};

export default AITrainerLanding;
