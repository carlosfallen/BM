-- Inserir categorias iniciais
INSERT INTO categories (name, slug, description, active) VALUES
('Freios', 'freios', 'Sistemas de freios completos, válvulas, cilindros e componentes para caminhões', 1),
('Válvulas', 'valvulas', 'Válvulas relé, emergência, descarga rápida e outros componentes pneumáticos', 1),
('Suspensão', 'suspensao', 'Componentes de suspensão pneumática e mecânica', 1),
('Transmissão', 'transmissao', 'Peças para transmissão ZF e outras marcas', 1);

-- Inserir produtos de exemplo
INSERT INTO products (category_id, name, slug, code, description, short_description, price, featured, active) VALUES
(1, 'Ajustador Automático', 'ajustador-automatico', 'AJ-001', 'Ajustador automático de folga para sistema de freios. Compatível com diversos modelos de caminhões pesados. Produto de alta qualidade e durabilidade.', 'Ajustador automático de folga para freios', 450.00, 1, 1),
(2, 'Válvula Relé e Emergência RE4', 'valvula-rele-emergencia-re4', 'VRE-004', 'Válvula Relé e Emergência RE4 - Sistema pneumático de alta eficiência para controle de freio. Fabricada com materiais de primeira qualidade.', 'Válvula Relé e Emergência RE4', 680.00, 1, 1),
(2, 'Válvula de Descarga Rápida', 'valvula-descarga-rapida', 'VDR-010', 'Válvula de descarga rápida para sistema de freio pneumático. Garante liberação rápida do ar comprimido.', 'Válvula de descarga rápida', 280.00, 1, 1),
(1, 'Válvula de Desfrenagem', 'valvula-desfrenagem', 'VDF-015', 'Válvula de desfrenagem para sistema de freio estacionário. Alta qualidade e durabilidade comprovada.', 'Válvula de desfrenagem', 520.00, 1, 1),
(4, 'Caneca da Transferência ZF', 'caneca-transferencia-zf', 'CTZ-020', 'Caneca da Transferência ZF - Componente original para transmissão ZF. Alta precisão e durabilidade.', 'Caneca da Transferência ZF', 890.00, 1, 1),
(2, 'Válvula Relé Moderna M16 Wabco', 'valvula-rele-moderna-m16-wabco', 'VRM-016', 'Válvula Relé Moderna M16 Wabco - Tecnologia de ponta para sistemas de freio modernos.', 'Válvula Relé Moderna M16', 750.00, 1, 1);

-- Inserir configurações do site
INSERT INTO settings (key, value) VALUES
('site_name', 'BM Peças Diesel'),
('site_description', 'Especializada em peças para sistemas de freios de caminhões'),
('whatsapp_number', '5519971477055'),
('email', 'bmpecasdiesel@gmail.com'),
('address', 'Avenida Estudante Gustavo Batistella, 890 - Residencial Campo Novo - Limeira/SP'),
('instagram', 'https://www.instagram.com/bmpecasdiesel/'),
('opening_hours', 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h');
