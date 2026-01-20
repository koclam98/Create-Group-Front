import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { meetingService } from '../services/meetingService';

// Mock the services
vi.mock('../services/meetingService', () => ({
    meetingService: {
        getAll: vi.fn(),
    },
}));

// Mock ImageSlider since it might have internal logic
vi.mock('../components/ui/ImageSlider', () => ({
    default: () => <div data-testid="image-slider">Image Slider</div>,
}));

describe('HomePage', () => {
    it('renders welcome message when no meetings exist', async () => {
        // Mock empty return
        (meetingService.getAll as any).mockResolvedValue([]);

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        );

        expect(screen.getByText('환영합니다!')).toBeInTheDocument();
        expect(screen.getByText('기타 모임 만들기')).toBeInTheDocument();
        expect(screen.getByText('참여자 목록')).toBeInTheDocument();
    });

    it('renders meeting title when meetings exist', async () => {
        const mockMeetings = [
            {
                id: '1',
                title: 'Test Meeting',
                category: 'Test',
                description: 'Test Description',
                createdAt: new Date(),
                participants: [],
            },
        ];

        (meetingService.getAll as any).mockResolvedValue(mockMeetings);

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('Test Meeting')).toBeInTheDocument();
        });
    });
});
