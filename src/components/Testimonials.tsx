
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dra. Marina Santos",
      role: "Dermatologista",
      clinic: "Clínica Pele Saudável",
      location: "São Paulo, SP",
      content: "O AgendoPro revolucionou minha clínica! A IA reduziu as faltas em 80% e o WhatsApp automático mantém meus pacientes sempre informados. Economizo 3 horas por dia que antes gastava organizando agenda.",
      rating: 5,
      avatar: "👩‍⚕️"
    },
    {
      name: "Carlos Mendes",
      role: "Proprietário",
      clinic: "Salão Elegance",
      location: "Rio de Janeiro, RJ",
      content: "Incrível como a plataforma gerencia 4 profissionais simultaneamente. Os clientes adoram poder reagendar pelo WhatsApp e nossa taxa de ocupação aumentou 45%. O investimento se pagou em 2 meses!",
      rating: 5,
      avatar: "💇‍♂️"
    },
    {
      name: "Dr. Roberto Lima",
      role: "Fisioterapeuta",
      clinic: "Fisio Vida",
      location: "Belo Horizonte, MG",
      content: "A automação é impressionante! Meus pacientes recebem lembretes automáticos e podem confirmar presença direto no WhatsApp. Diminuiu muito o trabalho da secretária e melhorou a experiência dos pacientes.",
      rating: 5,
      avatar: "🏥"
    },
    {
      name: "Ana Paula Costa",
      role: "Psicóloga",
      clinic: "Consultório Bem-Estar",
      location: "Brasília, DF",
      content: "Como trabalho sozinha, o AgendoPro é meu assistente pessoal! A IA cuida de tudo automaticamente: confirmações, lembretes e até reagendamentos. Posso focar 100% nos meus pacientes.",
      rating: 5,
      avatar: "🧠"
    },
    {
      name: "Rafael Oliveira",
      role: "Personal Trainer",
      clinic: "Studio Fit",
      location: "Curitiba, PR",
      content: "Fantástico para gerenciar aulas e personal training! O sistema otimiza minha agenda automaticamente e os alunos podem agendar 24h pelo link. Minha receita aumentou 60% em 6 meses.",
      rating: 5,
      avatar: "💪"
    },
    {
      name: "Dra. Luciana Torres",
      role: "Dentista",
      clinic: "Odonto Excellence",
      location: "Salvador, BA",
      content: "A integração com WhatsApp é perfeita! Pacientes confirmam consultas, recebem orientações pós-procedimento automaticamente. A IA até sugere horários baseados no histórico. Simplesmente incrível!",
      rating: 5,
      avatar: "🦷"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          
          {/* Seção movida da Index */}
          <div className="mb-8">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Mais de 3.000 profissionais confiam no AgendoPro
            </p>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{i}</span>
                  </div>
                ))}
              </div>
              <span className="text-yellow-500 text-xl">★★★★★</span>
              <span className="text-gray-600">4.9/5 avaliação média</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-600 opacity-50" />
                  <div className="flex ml-auto">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.clinic}</p>
                    <p className="text-xs text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.9/5</span>
            <span className="text-gray-500">• Mais de 2.500 avaliações</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
