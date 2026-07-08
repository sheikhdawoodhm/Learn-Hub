import pool from '../dbSetup/db';

export const seedDatabase = async () => {
  console.log(' Starting database seed...');
  try {
    // Clear out existing data cleanly, managing dependencies
    await pool.query('TRUNCATE videos, modules, courses CASCADE;');
    console.log(' Clearing old data...');

    const courses = [
      // --- Web Development ---
      { 
        title: 'The Complete Web Developer in 2026', 
        description: 'Learn React, Node, SQL, and modern full-stack deployment workflows.', 
        category: 'Web Development', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 
        channel_url: 'https://www.youtube.com/@programmingwithmosh' 
      },
      { 
        title: 'Next.js 15 Full Stack Mastery', 
        description: 'Build production-ready React apps using Server Actions and App Router.', 
        category: 'Web Development', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 
        channel_url: 'https://www.youtube.com/@CodeWithAntonio' 
      },
      { 
        title: 'Tailwind CSS Essentials', 
        description: 'Master utility-first CSS styling to build responsive, gorgeous UIs quickly.', 
        category: 'Web Development', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8', 
        channel_url: 'https://www.youtube.com/@BenjaminCode' 
      },
      { 
        title: 'TypeScript Deep Dive', 
        description: 'Move past basic types. Master generics, advanced types, and type guards.', 
        category: 'Web Development', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a', 
        channel_url: 'https://www.youtube.com/@MattPocockCode' 
      },
      { 
        title: 'The Ultimate Vue 3 & Nuxt Guide', 
        description: 'Build lightning-fast, SEO-optimized Vue apps using the Composition API.', 
        category: 'Web Development', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2', 
        channel_url: 'https://www.youtube.com/@NetNinja' 
      },

      // --- Programming Languages ---
      { 
        title: 'Python for Beginners', 
        description: 'Start your coding journey with Python syntax, OOP, and script automation.', 
        category: 'Programming', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', 
        channel_url: 'https://www.youtube.com/@CoreySchafer' 
      },
      { 
        title: 'Go Programming (Golang): The Complete Guide', 
        description: 'Master Go syntax, concurrency with goroutines, and building backend services.', 
        category: 'Programming', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871', 
        channel_url: 'https://www.youtube.com/@anthonygg_' 
      },
      { 
        title: 'Modern C++ Programming', 
        description: 'Learn memory management, pointers, STL containers, and modern C++ templates.', 
        category: 'Programming', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1605379399642-870262d3d051', 
        channel_url: 'https://www.youtube.com/@TheCherno' 
      },
      { 
        title: 'Rust for Systems Engineering', 
        description: 'Understand ownership, borrowing, lifetimes, and write memory-safe code.', 
        category: 'Programming', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97', 
        channel_url: 'https://www.youtube.com/@NoBoilerplate' 
      },
      { 
        title: 'Java Core and Spring Boot', 
        description: 'Build enterprise-ready web applications and microservices using Spring.', 
        category: 'Programming', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 
        channel_url: 'https://www.youtube.com/@amigoscode' 
      },

      // --- Computer Science & Data Structures ---
      { 
        title: 'Advanced Data Structures & Algorithms', 
        description: 'Master complex trees, graphs, dynamic programming, and FAANG interview problems.', 
        category: 'Computer Science', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 
        channel_url: 'https://www.youtube.com/@neetcode' 
      },
      { 
        title: 'Database Design and SQL Fundamentals', 
        description: 'Understand indexing, normalization, ACID properties, and query optimization.', 
        category: 'Computer Science', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d', 
        channel_url: 'https://www.youtube.com/@hnasr' 
      },

      // --- Data Science & AI ---
      { 
        title: 'Machine Learning A-Z', 
        description: 'Learn data preprocessing, regression, classification, and clustering with Scikit-Learn.', 
        category: 'Data Science', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc', 
        channel_url: 'https://www.youtube.com/@krishnaik06' 
      },
      { 
        title: 'Deep Learning with PyTorch', 
        description: 'Build artificial neural networks, CNNs for computer vision, and RNNs for text.', 
        category: 'Data Science', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8', 
        channel_url: 'https://www.youtube.com/@DanielBourke' 
      },
      { 
        title: 'Generative AI and LLM Engineering', 
        description: 'Fine-tune large language models, build vector search systems, and leverage RAG architectures.', 
        category: 'Data Science', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a', 
        channel_url: 'https://www.youtube.com/@andrejkarpathy' 
      },
      { 
        title: 'Data Analysis with Pandas & NumPy', 
        description: 'Clean, manipulate, and visualize raw historical data sets using Python data stacks.', 
        category: 'Data Science', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 
        channel_url: 'https://www.youtube.com/@AlexTheAnalyst' 
      },

      // --- DevOps & Cloud Architecture ---
      { 
        title: 'Docker & Kubernetes Bootcamp', 
        description: 'Containerize, orchestrate, and automatically scale modern microservice deployments.', 
        category: 'DevOps', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76', 
        channel_url: 'https://www.youtube.com/@TechWorldwithNana' 
      },
      { 
        title: 'Cloud Architecture on AWS', 
        description: 'Design fault-tolerant, highly scalable, secure enterprise solutions on Amazon Web Services.', 
        category: 'Cloud', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 
        channel_url: 'https://www.youtube.com/@freecodecamp' 
      },
      { 
        title: 'Linux Command Line Masterclass', 
        description: 'Master bash scripting, cron jobs, user access levels, and server file system navigation.', 
        category: 'DevOps', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97', 
        channel_url: 'https://www.youtube.com/@LearnLinuxTV' 
      },
      { 
        title: 'CI/CD Pipelines with GitHub Actions', 
        description: 'Automate testing, building, and seamless production delivery routines on push commits.', 
        category: 'DevOps', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871', 
        channel_url: 'https://www.youtube.com/@DevOpsDirective' 
      },

      // --- Design & UI/UX ---
      { 
        title: 'UI/UX Design Masterclass', 
        description: 'Design beautiful, highly functional mobile and web app layouts using Figma tools.', 
        category: 'Design', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5', 
        channel_url: 'https://www.youtube.com/@FluxAcademy' 
      },
      { 
        title: 'Figma Component Systems & Auto Layout', 
        description: 'Build complex, scalable design patterns using advanced Auto Layout logic.', 
        category: 'Design', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf', 
        channel_url: 'https://www.youtube.com/@DesignCourse' 
      },

      // --- Mobile Development ---
      { 
        title: 'Mobile App Dev with React Native', 
        description: 'Write cross-platform mobile apps for iOS and Android platforms out of one codebase.', 
        category: 'Mobile', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 
        channel_url: 'https://www.youtube.com/@bizzfuzz' 
      },
      { 
        title: 'Flutter & Dart Production Guide', 
        description: 'Build fast, native-performing application models complete with animations and smooth state logic.', 
        category: 'Mobile', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3', 
        channel_url: 'https://www.youtube.com/@NetNinja' 
      },

      // --- Cyber Security ---
      { 
        title: 'Ethical Hacking Fundamentals', 
        description: 'Learn penetration testing framework basics, network scanning setups, and system defense checks.', 
        category: 'Cyber Security', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', 
        channel_url: 'https://www.youtube.com/@NetworkChuck' 
      },
      { 
        title: 'Web Application Penetration Testing', 
        description: 'Discover and mitigate common vulnerabilities listed under the OWASP Top 10 framework index.', 
        category: 'Cyber Security', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3', 
        channel_url: 'https://www.youtube.com/@JohnHammond010' 
      },

      // --- Blockchain & Web3 ---
      { 
        title: 'Smart Contract Dev with Solidity', 
        description: 'Write, debug, and test decentralized application contracts on the Ethereum blockchain ecosystem.', 
        category: 'Web3', difficulty: 'Advanced', 
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0', 
        channel_url: 'https://www.youtube.com/@PatrickCollins' 
      },

      // --- Game Development ---
      { 
        title: 'Unity 2D & 3D Game Design', 
        description: 'Master engine scenes, physics scripts, user UI HUD overlays, and custom compilation targets.', 
        category: 'Game Development', difficulty: 'Beginner', 
        thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f', 
        channel_url: 'https://www.youtube.com/@Brackeys' 
      },
      { 
        title: 'Unreal Engine 5 Blueprint Systems', 
        description: 'Create massive environments and high-fidelity gameplay loops without writing standard code.', 
        category: 'Game Development', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', 
        channel_url: 'https://www.youtube.com/@SmartPoly' 
      },

      // --- Product & QA ---
      { 
        title: 'Automated Testing with Playwright', 
        description: 'Write fast, modern end-to-end user browser automation scripts for validation.', 
        category: 'Software Testing', difficulty: 'Intermediate', 
        thumbnail: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a', 
        channel_url: 'https://www.youtube.com/@testersdock' 
      }
    ];

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      
      // Ensure your SQL table schema includes 'video_url' or 'channel_url' column names matching this configuration
      const courseRes = await pool.query(
        'INSERT INTO courses (title, description, category, difficulty, thumbnail_url) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
        [c.title, c.description, c.category, c.difficulty, c.thumbnail]
      );
      const courseId = courseRes.rows[0].id;
      
      // Create 3 specific modules for each course context
      for (let m = 1; m <= 3; m++) {
        let moduleTitle = '';
        if (m === 1) moduleTitle = `Module 1: Foundations of ${c.category}`;
        if (m === 2) moduleTitle = `Module 2: Core Concepts & Practice`;
        if (m === 3) moduleTitle = `Module 3: Advanced Applications & Implementation`;

        const modRes = await pool.query(
          'INSERT INTO modules (course_id, title, module_order) VALUES ($1, $2, $3) RETURNING id;',
          [courseId, moduleTitle, m]
        );
        const modId = modRes.rows[0].id;

        // Populate individual video links targeting the tailored YouTube channel directly
        for (let v = 1; v <= 3; v++) {
          await pool.query(
            'INSERT INTO videos (module_id, title, video_url, video_order) VALUES ($1, $2, $3, $4);',
            [modId, `Lesson ${v}: Deep Dive Strategy Part ${v}`, 'https://www.youtube.com/watch?v=M7lc1UVf-VE', v]
          );
        }
      }
      console.log(`✅ Seeded Course ${i + 1}/${courses.length}: ${c.title}`);
    }

    console.log('🎉 Database seeding complete! 30 Courses successfully loaded.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();