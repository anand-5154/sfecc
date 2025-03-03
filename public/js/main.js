// Delete news function for admin
async function deleteNews(newsId) {
    if (confirm('Are you sure you want to delete this news?')) {
        try {
            const response = await fetch(`/news/${newsId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.success) {
                window.location.href = '/news';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete news');
        }
    }
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 