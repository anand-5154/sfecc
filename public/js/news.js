document.addEventListener('DOMContentLoaded', function() {
    const handleAction = async (button, action) => {
        const newsId = button.dataset.id;
        try {
            const response = await fetch(`/news/${newsId}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Update counts
                button.closest('.news-actions').querySelector('.like-count').textContent = data.likes;
                button.closest('.news-actions').querySelector('.dislike-count').textContent = data.dislikes;
                
                // Toggle active states
                if (action === 'like') {
                    button.dataset.liked = !(button.dataset.liked === 'true');
                    const dislikeBtn = button.nextElementSibling;
                    dislikeBtn.dataset.disliked = 'false';
                } else {
                    button.dataset.disliked = !(button.dataset.disliked === 'true');
                    const likeBtn = button.previousElementSibling;
                    likeBtn.dataset.liked = 'false';
                }
            } else {
                // If not logged in, redirect to login page
                window.location.href = '/auth/login';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Add click handlers for like/dislike buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => handleAction(button, 'like'));
    });

    document.querySelectorAll('.dislike-btn').forEach(button => {
        button.addEventListener('click', () => handleAction(button, 'dislike'));
    });
}); 