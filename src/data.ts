export type Prompt = { id: number; topic: string; level: 'Cơ bản' | 'Trung bình' | 'Nâng cao'; title: string; quote: string; outline: string[] }

const subjects: Array<{ topic: string; prompts: string[] }> = [
  { topic: 'Ý chí & nghị lực', prompts: ['Sức mạnh của ý chí trước nghịch cảnh', 'Học cách đứng dậy sau thất bại', 'Nghị lực sống của người trẻ hôm nay', 'Kiên trì có phải là chìa khóa thành công?', 'Dám bước ra khỏi vùng an toàn'] },
  { topic: 'Lòng nhân ái', prompts: ['Sự tử tế trong đời sống hiện đại', 'Cho đi và nhận lại trong cuộc sống', 'Lòng trắc ẩn trước những số phận khó khăn', 'Một hành động nhỏ, ý nghĩa lớn', 'Sống nhân ái trong cộng đồng số'] },
  { topic: 'Trách nhiệm', prompts: ['Trách nhiệm của tuổi trẻ với quê hương', 'Sống có trách nhiệm với lời nói của mình', 'Ý thức cộng đồng bắt đầu từ mỗi người', 'Trách nhiệm bảo vệ môi trường sống', 'Lựa chọn cá nhân và trách nhiệm xã hội'] },
  { topic: 'Ước mơ & khát vọng', prompts: ['Vai trò của ước mơ trong hành trình trưởng thành', 'Khát vọng cống hiến của thế hệ trẻ', 'Theo đuổi đam mê bằng sự tỉnh táo', 'Ước mơ cần đi cùng hành động', 'Dám nghĩ lớn và bắt đầu từ điều nhỏ'] },
  { topic: 'Tình bạn', prompts: ['Tình bạn đẹp trong tuổi học trò', 'Lắng nghe để thấu hiểu nhau', 'Tình bạn trong thời đại mạng xã hội', 'Sự chân thành tạo nên tình bạn bền lâu', 'Biết nói lời xin lỗi với bạn bè'] },
  { topic: 'Gia đình', prompts: ['Gia đình là điểm tựa của mỗi người', 'Sự thấu hiểu giữa các thế hệ', 'Lòng biết ơn đối với cha mẹ', 'Chia sẻ việc nhà là sẻ chia yêu thương', 'Giữ gìn nếp nhà trong cuộc sống hiện đại'] },
  { topic: 'Học tập & tri thức', prompts: ['Tự học trong kỷ nguyên số', 'Đọc sách và khả năng tư duy sâu', 'Học từ thất bại và trải nghiệm', 'Tinh thần học tập suốt đời', 'Trung thực trong học tập và thi cử'] },
  { topic: 'Bản lĩnh người trẻ', prompts: ['Bản lĩnh trước áp lực đồng trang lứa', 'Tuổi trẻ và lựa chọn sống có ích', 'Dũng cảm bảo vệ điều đúng', 'Tư duy độc lập giữa nhiều luồng ý kiến', 'Không ngừng làm mới chính mình'] },
  { topic: 'Mạng xã hội', prompts: ['Ứng xử văn minh trên không gian mạng', 'Suy nghĩ trước khi chia sẻ thông tin', 'Mạng xã hội và thói quen đọc sâu', 'Bảo vệ bản thân trước tin giả', 'Giữ kết nối thật trong thế giới số'] },
  { topic: 'Môi trường', prompts: ['Sống xanh từ những lựa chọn hàng ngày', 'Trách nhiệm của người trẻ trước biến đổi khí hậu', 'Giảm rác thải nhựa trong trường học', 'Thiên nhiên và sức khỏe tinh thần', 'Phát triển bền vững bắt đầu từ cộng đồng'] },
  { topic: 'Văn hóa & bản sắc', prompts: ['Giữ gìn tiếng Việt trong thời đại số', 'Bản sắc văn hóa trong hội nhập', 'Trân trọng những giá trị truyền thống', 'Người trẻ với di sản quê hương', 'Học cách tiếp nhận văn hóa có chọn lọc'] },
  { topic: 'Trung thực', prompts: ['Giá trị của sự trung thực', 'Dũng khí nhận lỗi và sửa sai', 'Trung thực với chính mình', 'Sự thật và trách nhiệm khi phát ngôn', 'Nói không với gian lận học đường'] },
  { topic: 'Lòng biết ơn', prompts: ['Biết ơn những điều bình dị', 'Tri ân người đã âm thầm giúp đỡ ta', 'Lòng biết ơn cần được thể hiện bằng hành động', 'Ghi nhớ cội nguồn và lịch sử', 'Biết ơn để sống có trách nhiệm hơn'] },
  { topic: 'Sức khỏe tinh thần', prompts: ['Chăm sóc sức khỏe tinh thần tuổi học trò', 'Dám tìm kiếm sự giúp đỡ khi cần', 'Cân bằng học tập và nghỉ ngơi', 'Áp lực thành tích và cách vượt qua', 'Lắng nghe cảm xúc của bản thân'] },
  { topic: 'Kỷ luật & thời gian', prompts: ['Kỷ luật bản thân tạo nên tự do', 'Quản lý thời gian hiệu quả', 'Giá trị của những thói quen tốt', 'Bắt đầu sớm thay vì chờ hoàn hảo', 'Kiên định với mục tiêu dài hạn'] },
  { topic: 'Lãnh đạo & hợp tác', prompts: ['Hợp tác để cùng tiến bộ', 'Vai trò của tinh thần đồng đội', 'Lãnh đạo bằng sự lắng nghe', 'Tôn trọng khác biệt trong làm việc nhóm', 'Chung tay giải quyết vấn đề cộng đồng'] },
  { topic: 'Công nghệ & AI', prompts: ['Sử dụng trí tuệ nhân tạo có trách nhiệm', 'Công nghệ hỗ trợ chứ không thay thế tư duy', 'Quyền riêng tư trong thế giới kết nối', 'Kỹ năng con người trong thời đại tự động hóa', 'Làm chủ công nghệ để phục vụ cuộc sống'] },
  { topic: 'Lòng dũng cảm', prompts: ['Dũng cảm là dám hành động đúng', 'Đối diện với nỗi sợ của chính mình', 'Can đảm lên tiếng trước bất công', 'Dũng cảm thay đổi khi nhận ra sai lầm', 'Sự bình tĩnh trong tình huống khó khăn'] },
  { topic: 'Khoan dung & thấu hiểu', prompts: ['Học cách nhìn sự việc từ góc nhìn khác', 'Khoan dung nhưng không thỏa hiệp với sai trái', 'Tôn trọng sự khác biệt', 'Đối thoại thay vì phán xét', 'Thấu hiểu giúp hóa giải mâu thuẫn'] },
  { topic: 'Cống hiến & cộng đồng', prompts: ['Tuổi trẻ với những việc làm có ích', 'Tình nguyện bằng sự chân thành', 'Sống không chỉ cho riêng mình', 'Sức mạnh của những hành động cộng đồng', 'Cống hiến từ năng lực và lòng nhiệt thành'] },
]

export const prompts: Prompt[] = subjects.flatMap(({ topic, prompts: titles }, group) => titles.map((title, index) => ({
  id: group * 5 + index + 1,
  topic,
  level: (index === 0 ? 'Cơ bản' : index === 4 ? 'Nâng cao' : 'Trung bình') as Prompt['level'],
  title,
  quote: 'Hãy trình bày suy nghĩ của anh/chị về vấn đề trên trong một bài văn nghị luận xã hội.',
  outline: ['Mở bài: Dẫn dắt tự nhiên và nêu vấn đề nghị luận.', 'Giải thích: Làm rõ khái niệm, biểu hiện và ý nghĩa của vấn đề.', 'Bàn luận: Phân tích nguyên nhân, giá trị và tác động trong đời sống.', 'Dẫn chứng: Chọn câu chuyện thực tế tiêu biểu, xác thực và gần gũi.', 'Mở rộng: Nhìn nhận mặt trái, phản biện biểu hiện lệch lạc.', 'Bài học: Rút ra nhận thức và hành động cụ thể cho bản thân.', 'Kết bài: Khẳng định ý nghĩa, mở ra suy ngẫm tích cực.'],
})))

export const evidence = [
  { name: 'Nguyễn Ngọc Ký', kind: 'Nghị lực cá nhân', detail: 'Vượt lên khiếm khuyết đôi tay, kiên trì tập viết bằng chân và trở thành nhà giáo, nhà văn.', themes: 'Nghị lực · Tự học · Kiên trì' },
  { name: 'Malala Yousafzai', kind: 'Giáo dục & dũng cảm', detail: 'Lên tiếng vì quyền được đến trường của trẻ em gái; trở thành biểu tượng toàn cầu về giáo dục.', themes: 'Dũng cảm · Giáo dục · Cống hiến' },
  { name: 'Dự án Nuôi Em', kind: 'Sáng kiến cộng đồng', detail: 'Kết nối sự chung tay để cải thiện bữa ăn và điều kiện học tập cho trẻ em vùng cao.', themes: 'Nhân ái · Cộng đồng · Trách nhiệm' },
  { name: 'Nhóm Sài Gòn Xanh', kind: 'Hành động môi trường', detail: 'Các tình nguyện viên cùng làm sạch kênh rạch, lan tỏa ý thức bảo vệ không gian sống.', themes: 'Môi trường · Hợp tác · Cống hiến' },
  { name: 'Helen Keller', kind: 'Vượt lên nghịch cảnh', detail: 'Dù khiếm thị và khiếm thính từ nhỏ, bà trở thành nhà văn, diễn giả và nhà hoạt động xã hội.', themes: 'Nghị lực · Học tập · Hy vọng' },
  { name: 'Sách hóa nông thôn', kind: 'Tri thức cộng đồng', detail: 'Mô hình thư viện thân thiện giúp trẻ em tiếp cận sách và hình thành thói quen đọc.', themes: 'Tri thức · Đọc sách · Cộng đồng' },
  { name: 'Đặng Thùy Trâm', kind: 'Y đức & lý tưởng', detail: 'Người bác sĩ trẻ tận tụy chăm sóc thương binh, để lại những trang nhật ký giàu lòng nhân ái.', themes: 'Trách nhiệm · Nhân ái · Lý tưởng' },
  { name: 'Cứu trợ bão Yagi 2024', kind: 'Tinh thần tương thân', detail: 'Nhiều cá nhân và tổ chức phối hợp hỗ trợ người dân vùng chịu ảnh hưởng bởi thiên tai.', themes: 'Đoàn kết · Nhân ái · Cộng đồng' },
]
