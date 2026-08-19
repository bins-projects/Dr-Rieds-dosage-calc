export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');
    const headers = {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    };

    if (!env.INSTRUCTOR_QUIZZES) {
      return new Response(JSON.stringify({ error: 'Instructor quiz storage is not bound' }), { status: 503, headers });
    }

    if (request.method === 'GET' && path === '/api/instructor-quizzes') {
      const raw = await env.INSTRUCTOR_QUIZZES.get('catalog');
      return new Response(raw || JSON.stringify({ version: 1, quizzes: [] }), { headers });
    }

    if (request.method === 'GET' && path.startsWith('/api/instructor-quizzes/')) {
      const id = decodeURIComponent(path.split('/').pop());
      const raw = await env.INSTRUCTOR_QUIZZES.get(`quiz:${id}`);
      if (!raw) return new Response(JSON.stringify({ error: 'Quiz not found' }), { status: 404, headers });
      return new Response(raw, { headers });
    }

    if (request.method === 'POST' && path === '/instructor-api/instructor-quizzes') {
      const accessUser = request.headers.get('cf-access-authenticated-user-email');
      if (!accessUser) {
        return new Response(JSON.stringify({ error: 'Cloudflare Access authentication required' }), { status: 401, headers });
      }

      let quiz;
      try { quiz = await request.json(); }
      catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers }); }

      if (!quiz || !quiz.id || !quiz.title || !Array.isArray(quiz.questions) || !quiz.questions.length) {
        return new Response(JSON.stringify({ error: 'Quiz id, title, and questions are required' }), { status: 400, headers });
      }

      const frozen = {
        ...quiz,
        status: 'published',
        questionCount: quiz.questions.length,
        publishedAt: new Date().toISOString(),
        publishedBy: accessUser
      };

      await env.INSTRUCTOR_QUIZZES.put(`quiz:${frozen.id}`, JSON.stringify(frozen));

      const existingRaw = await env.INSTRUCTOR_QUIZZES.get('catalog');
      const catalog = existingRaw ? JSON.parse(existingRaw) : { version: 1, quizzes: [] };
      const summary = {
        id: frozen.id,
        title: frozen.title,
        questionCount: frozen.questionCount,
        questionTypes: frozen.questionTypes || [],
        publishedAt: frozen.publishedAt
      };
      const withoutOld = (catalog.quizzes || []).filter(x => x.id !== frozen.id);
      catalog.quizzes = [summary, ...withoutOld];
      await env.INSTRUCTOR_QUIZZES.put('catalog', JSON.stringify(catalog));

      return new Response(JSON.stringify({ ok: true, id: frozen.id }), { status: 201, headers });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  }
};
